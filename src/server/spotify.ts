import { createServerFn } from '@tanstack/react-start'

import { getServerEnv } from '@/constants/env'
import { LRUCache } from '@/lib/lru-cache'

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
  getServerEnv()

const CURRENTLY_PLAYING_ENDPOINT =
  'https://api.spotify.com/v1/me/player/currently-playing'
const RECENTLY_PLAYED_ENDPOINT =
  'https://api.spotify.com/v1/me/player/recently-played?limit=5'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'
const BASIC_AUTH = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString('base64')
const RETRYABLE_SPOTIFY_STATUSES = new Set([401, 403, 500, 502, 503, 504])

type TSpotifyAccessToken = {
  value: string
  scope: string
  expiresAt: number
}

type TSpotifyArtist = {
  external_urls: { spotify: string }
  id: string
  name: string
}

type TSpotifyTrack = {
  album: {
    images: Array<{ url: string }>
    name: string
  }
  artists: Array<TSpotifyArtist>
  external_urls: { spotify: string }
  name: string
}

type TCurrentlyPlayingResponse = {
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown'
  is_playing: boolean
  item: TSpotifyTrack | null
}

type TRecentlyPlayedResponse = {
  items: Array<{ track: TSpotifyTrack }>
}

export type TSpotifyDisplayTrack = {
  albumName: string
  artists: Array<{
    id: string
    name: string
    url: string
  }>
  imageUrl: string | null
  name: string
  url: string
}

export type TSpotifyDisplayData = {
  isCurrentlyPlaying: boolean
  track: TSpotifyDisplayTrack | null
}

let accessTokenCache: TSpotifyAccessToken | null = null
let tokenRefreshPromise: Promise<TSpotifyAccessToken | null> | null = null
let activeRefreshToken = SPOTIFY_REFRESH_TOKEN

function logSpotifyError(
  context: string,
  error: unknown,
  details?: Record<string, unknown>,
): void {
  console.error(`Spotify ${context} failed:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    ...details,
  })
}

async function refreshSpotifyAccessToken(): Promise<TSpotifyAccessToken | null> {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: activeRefreshToken,
      }),
    })
    const data = (await response.json()) as {
      access_token?: unknown
      error?: unknown
      error_description?: unknown
      expires_in?: unknown
      refresh_token?: unknown
      scope?: unknown
    }

    if (!response.ok) {
      logSpotifyError('token refresh', new Error('Spotify request failed'), {
        status: response.status,
        error: data.error,
        description: data.error_description,
      })
      return null
    }

    if (typeof data.access_token !== 'string' || !data.access_token) {
      logSpotifyError(
        'token refresh',
        new Error('Response did not include an access token'),
      )
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
  } catch (error: unknown) {
    logSpotifyError('token refresh', error)
    return null
  }
}

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

  const refreshPromise = refreshSpotifyAccessToken().finally(() => {
    if (tokenRefreshPromise === refreshPromise) {
      tokenRefreshPromise = null
    }
  })

  tokenRefreshPromise = refreshPromise
  return refreshPromise
}

async function requestSpotifyData<T>(
  endpoint: string,
  accessToken: TSpotifyAccessToken,
  context: string,
): Promise<T | null> {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      })

      if (response.ok) {
        if (response.status === 204) return null
        return (await response.json()) as T
      }

      const shouldRetry =
        attempt < maxAttempts && RETRYABLE_SPOTIFY_STATUSES.has(response.status)

      if (shouldRetry) {
        await new Promise((resolve) =>
          setTimeout(resolve, 250 * 2 ** (attempt - 1)),
        )
        continue
      }

      logSpotifyError(context, new Error('Spotify request failed'), {
        attempts: attempt,
        grantedScopes: accessToken.scope,
        status: response.status,
      })
      return null
    } catch (error: unknown) {
      logSpotifyError(context, error, {
        attempts: attempt,
        grantedScopes: accessToken.scope,
      })
      return null
    }
  }

  return null
}

function normalizeTrack(track: TSpotifyTrack): TSpotifyDisplayTrack {
  return {
    albumName: track.album.name,
    artists: track.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      url: artist.external_urls.spotify,
    })),
    imageUrl: track.album.images[0]?.url ?? null,
    name: track.name,
    url: track.external_urls.spotify,
  }
}

const spotifyCache = new LRUCache<TSpotifyDisplayData>({
  maxSize: 10,
  defaultTTL: 15 * 1000,
})

export const getCurrentlyPlaying = createServerFn().handler(async () => {
  const cacheKey = 'currently-playing'
  const cached = spotifyCache.get(cacheKey)

  if (cached) return cached

  const accessToken = await getSpotifyAccessToken()

  if (!accessToken) {
    return { isCurrentlyPlaying: false, track: null }
  }

  const [currentlyPlaying, recentlyPlayed] = await Promise.all([
    requestSpotifyData<TCurrentlyPlayingResponse>(
      CURRENTLY_PLAYING_ENDPOINT,
      accessToken,
      'currently playing request',
    ),
    requestSpotifyData<TRecentlyPlayedResponse>(
      RECENTLY_PLAYED_ENDPOINT,
      accessToken,
      'recently played request',
    ),
  ])

  const isCurrentlyPlaying = Boolean(
    currentlyPlaying?.is_playing &&
    currentlyPlaying.currently_playing_type === 'track' &&
    currentlyPlaying.item,
  )
  const track = isCurrentlyPlaying
    ? currentlyPlaying?.item
    : recentlyPlayed?.items[0]?.track
  const result = {
    isCurrentlyPlaying,
    track: track ? normalizeTrack(track) : null,
  }

  spotifyCache.set(cacheKey, result)
  return result
})
