import { createServerFn } from '@tanstack/react-start'
import { isAxiosError } from 'axios'

import { axiosApi } from '@/lib/axios'
import { LRUCache } from '@/lib/lru-cache'
import { getServerEnv } from '@/constants/env'

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  getServerEnv()

const CURRENTLY_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const BASIC_AUTH = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString('base64')

function logSpotifyError(
  context: string,
  error: unknown,
  details?: Record<string, unknown>,
): void {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | {
          error?: string | { message?: string; status?: number }
          error_description?: string
        }
      | undefined

    console.error(`Spotify ${context} failed:`, {
      status: error.response?.status,
      error: typeof data?.error === 'string' ? data.error : data?.error?.status,
      message:
        data?.error_description ??
        (typeof data?.error === 'object' ? data.error.message : undefined) ??
        error.message,
      ...details,
    })
    return
  }

  console.error(
    `Spotify ${context} failed:`,
    error instanceof Error ? error.message : 'Unknown error',
  )
}

type TSpotifyAccessToken = {
  value: string
  scope: string
  expiresAt: number
}

let accessTokenCache: TSpotifyAccessToken | null = null
let tokenRefreshPromise: Promise<TSpotifyAccessToken | null> | null = null
let activeRefreshToken = SPOTIFY_REFRESH_TOKEN

function getSpotifyAccessToken(): Promise<TSpotifyAccessToken | null> {
  const expiryBuffer = 60 * 1000

  if (
    accessTokenCache &&
    accessTokenCache.expiresAt > Date.now() + expiryBuffer
  ) {
    return Promise.resolve(accessTokenCache)
  }

  if (tokenRefreshPromise) {
    return tokenRefreshPromise
  }

  const refreshPromise = axiosApi
    .post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: activeRefreshToken,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${BASIC_AUTH}`,
        },
      },
    )
    .then((res): TSpotifyAccessToken | null => {
      const data = res.data as {
        access_token?: unknown
        expires_in?: unknown
        refresh_token?: unknown
        scope?: unknown
      }

      if (typeof data.access_token !== 'string' || !data.access_token) {
        console.error('Spotify token refresh failed:', {
          message: 'Response did not include an access token',
        })
        return null
      }

      if (typeof data.refresh_token === 'string' && data.refresh_token) {
        activeRefreshToken = data.refresh_token
      }

      const expiresIn =
        typeof data.expires_in === 'number' ? data.expires_in : 3600

      accessTokenCache = {
        value: data.access_token,
        scope: typeof data.scope === 'string' ? data.scope : '',
        expiresAt: Date.now() + expiresIn * 1000,
      }

      return accessTokenCache
    })
    .catch((error: unknown) => {
      logSpotifyError('token refresh', error)
      return null
    })
    .finally(() => {
      if (tokenRefreshPromise === refreshPromise) {
        tokenRefreshPromise = null
      }
    })

  tokenRefreshPromise = refreshPromise
  return refreshPromise
}

const RETRYABLE_SPOTIFY_STATUSES = new Set([401, 403, 500, 502, 503, 504])

async function requestSpotifyData<T>(
  endpoint: string,
  accessToken: TSpotifyAccessToken,
  context: string,
): Promise<T | null> {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await axiosApi.get<T | null>(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      })

      return response.data || null
    } catch (error: unknown) {
      const status = isAxiosError(error) ? error.response?.status : undefined
      const shouldRetry =
        attempt < maxAttempts &&
        status !== undefined &&
        RETRYABLE_SPOTIFY_STATUSES.has(status)

      if (shouldRetry) {
        await new Promise((resolve) =>
          setTimeout(resolve, 250 * 2 ** (attempt - 1)),
        )
        continue
      }

      logSpotifyError(context, error, {
        attempts: attempt,
        grantedScopes: accessToken.scope,
      })
      return null
    }
  }

  return null
}

// Cache currently playing data for 15 seconds
const spotifyCache = new LRUCache<{
  currentlyPlaying: TCurrentlyPlaying | null
  recentlyPlayed: TRecentlyPlayed | null
}>({
  maxSize: 10,
  defaultTTL: 15 * 1000, // 15 seconds
})

export const getCurrentlyPlaying = createServerFn().handler(async () => {
  const cacheKey = 'currently-playing'
  const cached = spotifyCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const accessToken = await getSpotifyAccessToken()

  if (!accessToken) {
    return {
      currentlyPlaying: null,
      recentlyPlayed: null,
    }
  }

  // Parallel data fetching
  const [currentlyPlaying, recentlyPlayed] = await Promise.all([
    requestSpotifyData<TCurrentlyPlaying>(
      CURRENTLY_PLAYING_ENDPOINT,
      accessToken,
      'currently playing request',
    ),
    requestSpotifyData<TRecentlyPlayed>(
      RECENTLY_PLAYED_ENDPOINT,
      accessToken,
      'recently played request',
    ),
  ])

  const result = {
    currentlyPlaying,
    recentlyPlayed,
  }

  spotifyCache.set(cacheKey, result)

  return result
})

export type TCurrentlyPlaying = {
  timestamp: number
  context: TContext
  progress_ms: number
  item: TTrack | null
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown'
  actions: {
    disallows: {
      pausing: boolean
      toggling_repeat_context: boolean
      toggling_repeat_track: boolean
      toggling_shuffle: boolean
    }
  }
  is_playing: boolean
}

export type TRecentlyPlayed = {
  items: Array<{ track: TTrack; played_at: string; context: TContext }>
  next: string
  cursors: { after: string; before: string }
  limit: number
  href: string
}

type TSimplifiedArtist = {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: 'artist'
  uri: string
}

type TTrack = {
  album: {
    album_type: 'album' | 'single' | 'compilation'
    artists: Array<TSimplifiedArtist>
    available_markets: Array<string>
    external_urls: {
      spotify: string
    }
    href: string
    id: string
    images: Array<{
      height: number
      url: string
      width: number
    }>
    name: string
    release_date: string
    release_date_precision: 'year' | 'month' | 'day'
    total_tracks: number
    type: 'album'
    uri: string
  }
  artists: Array<TSimplifiedArtist>
  available_markets: Array<string>
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: { isrc: string }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string | null
  track_number: number
  type: 'track'
  uri: string
}

type TContext = {
  type: string
  href: string
  external_urls: {
    spotify: string
  }
  uri: string
} | null
