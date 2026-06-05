import { cn } from '@/lib/utils'
import { useGetCurrentlyPlayingQuery } from '@/hooks/api/spotify'

export const Spotify = () => {
  const currentlyPlayingQuery = useGetCurrentlyPlayingQuery()

  const currentlyPlaying = currentlyPlayingQuery.data?.currentlyPlaying
  const recentlyPlayed = currentlyPlayingQuery.data?.recentlyPlayed

  const isCurrentlyPlaying =
    currentlyPlaying?.is_playing &&
    currentlyPlaying?.currently_playing_type === 'track'

  const song = isCurrentlyPlaying
    ? currentlyPlaying?.item
    : recentlyPlayed?.items?.[0]?.track

  const artists = isCurrentlyPlaying
    ? currentlyPlaying?.item?.artists
    : recentlyPlayed?.items?.[0]?.track.artists

  const artistsName = isCurrentlyPlaying
    ? currentlyPlaying?.item?.artists.map((artist) => artist.name).join(', ')
    : recentlyPlayed?.items?.[0]?.track?.artists
        .map((artist) => artist.name)
        .join(', ')

  return (
    <section className="grid grid-cols-[1.5rem_1fr] gap-3 select-none">
      <a
        href="https://open.spotify.com/user/312wkcarckpr64ibtf3jvgnvpnyi"
        target="_blank"
        rel="noopener noreferrer"
        title="go to my spotify profile"
        className="cursor-external-link"
      >
        <svg viewBox="0 0 32 32" className="size-6">
          <path
            fill="#25d865"
            d="M16 0C7.197 0 0 7.197 0 16s7.197 16 16 16s16-7.197 16-16S24.88 0 16 0m7.36 23.12c-.319.479-.881.64-1.36.317c-3.76-2.317-8.479-2.797-14.083-1.52c-.557.165-1.037-.235-1.199-.72c-.156-.557.24-1.036.719-1.197c6.084-1.36 11.365-.803 15.521 1.76c.563.24.64.88.401 1.36zm1.921-4.401c-.401.563-1.12.803-1.683.401c-4.317-2.641-10.88-3.437-15.916-1.839c-.641.156-1.365-.161-1.521-.803c-.161-.64.156-1.359.797-1.52c5.844-1.761 13.041-.876 18 2.161c.484.24.724 1.041.323 1.599zm.162-4.479c-5.125-3.043-13.683-3.36-18.563-1.839c-.801.239-1.599-.24-1.839-.964c-.239-.797.24-1.599.959-1.839c5.683-1.681 15.041-1.359 20.964 2.161c.719.401.957 1.36.557 2.079c-.401.563-1.36.801-2.079.401z"
          />
        </svg>
      </a>

      {song && artists && artistsName ? (
        <div className="flex flex-col">
          <span className="text-muted-foreground flex h-6 items-center text-sm">
            {isCurrentlyPlaying
              ? 'Currently Playing'
              : 'Offline. Recently Played'}
          </span>

          <a
            href={song?.external_urls?.spotify ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            title={`open ${song?.name} by ${artistsName} in spotify web player`}
            className="cursor-external-link line-clamp-1 w-fit"
          >
            <span>{song?.name}</span>

            <span className="text-muted-foreground">
              <span> - </span>
              <span>{artistsName}</span>
            </span>
          </a>
        </div>
      ) : (
        <div
          className={cn(
            currentlyPlayingQuery.isLoading && '*:animate-pulse *:blur-sm',
          )}
        >
          <span className="text-muted-foreground line-clamp-1 flex h-6 items-center text-sm">
            Spotify
          </span>
          <span className="line-clamp-1">Not currently playing</span>
        </div>
      )}
    </section>
  )
}
