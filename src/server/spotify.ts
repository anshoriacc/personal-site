import { createServerFn } from '@tanstack/react-start'

import { axiosApi } from '@/lib/axios'
import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} from '@/constants/env'

const CURRENTLY_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`
const BASIC_AUTH = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
).toString('base64')

export const getCurrentlyPlaying = createServerFn().handler(async () => {
  const requestToken = await axiosApi
    .post(
      TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: SPOTIFY_REFRESH_TOKEN!,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${BASIC_AUTH}`,
        },
      },
    )
    .then((res) => res.data || null)
    .catch(() => null)

  if (!requestToken) {
    return {
      currentlyPlaying: null,
      recentlyPlayed: null,
    }
  }

  const { access_token } = requestToken

  const currentlyPlaying = await axiosApi
    .get<TCurrentlyPlaying | null>(CURRENTLY_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((res) => res.data || null)
    .catch(() => null)

  const recentlyPlayed = await axiosApi
    .get<TRecentlyPlayed | null>(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    .then((res) => res.data || null)
    .catch(() => null)

  return {
    currentlyPlaying,
    recentlyPlayed,
  }
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
  popularity: 66
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
