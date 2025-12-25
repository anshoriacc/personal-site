export type TCurrentlyPlaying = {
  timestamp: number;
  context: TContext;
  progress_ms: number;
  item: TTrack | null;
  currently_playing_type: "track" | "episode" | "ad" | "unknown";
  actions: {
    disallows: {
      pausing: boolean;
      toggling_repeat_context: boolean;
      toggling_repeat_track: boolean;
      toggling_shuffle: boolean;
    };
  };
  is_playing: boolean;
};

export type TRecentlyPlayed = {
  items: Array<{ track: TTrack; played_at: string; context: TContext }>;
  next: string;
  cursors: { after: string; before: string };
  limit: number;
  href: string;
};

type TSimplifiedArtist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
};

type TTrack = {
  album: {
    album_type: "album" | "single" | "compilation";
    artists: Array<TSimplifiedArtist>;
    available_markets: Array<string>;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: Array<{
      height: number;
      url: string;
      width: number;
    }>;
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    total_tracks: number;
    type: "album";
    uri: string;
  };
  artists: Array<TSimplifiedArtist>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { isrc: string };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: 66;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
};

type TContext = {
  type: string;
  href: string;
  external_urls: {
    spotify: string;
  };
  uri: string;
} | null;
