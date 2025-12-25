"use server";

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} from "@/constants/env";
import { TCurrentlyPlaying, TRecentlyPlayed } from "./type";

export type TCurrentlyPlayingResponse = {
  currentlyPlaying: TCurrentlyPlaying | null;
  recentlyPlayed: TRecentlyPlayed | null;
};

const CURRENTLY_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const BASIC_AUTH = Buffer.from(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
).toString("base64");

async function parseJsonResponse<T>(res: Response): Promise<T | null> {
  if (!res.ok) {
    console.error(`Spotify API error: ${res.status} ${res.statusText}`);
    return null;
  }

  const text = await res.text();
  return text ? (JSON.parse(text) as T) : null;
}

async function getAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${BASIC_AUTH}`,
      },
      body: `grant_type=refresh_token&refresh_token=${SPOTIFY_REFRESH_TOKEN}`,
    });

    const data = await res.json();
    return data.access_token || null;
  } catch (error) {
    console.error("Failed to get Spotify access token:", error);
    return null;
  }
}

async function fetchSpotifyData<T>(
  endpoint: string,
  accessToken: string
): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return parseJsonResponse<T>(res);
  } catch (error) {
    console.error(`Failed to fetch from ${endpoint}:`, error);
    return null;
  }
}

export const getCurrentlyPlaying =
  async (): Promise<TCurrentlyPlayingResponse> => {
    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        console.error("Failed to authenticate with Spotify");
        return {
          currentlyPlaying: null,
          recentlyPlayed: null,
        };
      }

      const [currentlyPlaying, recentlyPlayed] = await Promise.all([
        fetchSpotifyData<TCurrentlyPlaying>(
          CURRENTLY_PLAYING_ENDPOINT,
          accessToken
        ),
        fetchSpotifyData<TRecentlyPlayed>(
          RECENTLY_PLAYED_ENDPOINT,
          accessToken
        ),
      ]);

      return {
        currentlyPlaying,
        recentlyPlayed,
      };
    } catch (error) {
      console.error("Error in getCurrentlyPlaying:", error);
      return {
        currentlyPlaying: null,
        recentlyPlayed: null,
      };
    }
  };
