"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";

import { cn } from "@/lib/utils";
import { useGetCurrentlyPlayingQuery } from "@/hooks/api/spotify";
import { EqualizerAnimatedIcon } from "./svg/equalizer-animated-icon";
import { Card } from "./ui/card-home";

export const Spotify = () => {
  const { data, isLoading } = useGetCurrentlyPlayingQuery();

  const isCurrentlyPlaying = useMemo(
    () =>
      data?.currentlyPlaying?.is_playing &&
      data?.currentlyPlaying?.currently_playing_type === "track",
    [data],
  );

  const song = useMemo(
    () =>
      isCurrentlyPlaying
        ? data?.currentlyPlaying?.item
        : data?.recentlyPlayed?.items?.[0]?.track,
    [data, isCurrentlyPlaying],
  );

  const artists = useMemo(
    () =>
      isCurrentlyPlaying
        ? data?.currentlyPlaying?.item?.artists
        : data?.recentlyPlayed?.items?.[0]?.track?.artists,
    [data, isCurrentlyPlaying],
  );

  const artistsName = useMemo(
    () =>
      isCurrentlyPlaying
        ? data?.currentlyPlaying?.item?.artists
            .map(artist => artist.name)
            .join(", ")
        : data?.recentlyPlayed?.items?.[0]?.track?.artists
            .map(artist => artist.name)
            .join(", "),
    [data, isCurrentlyPlaying],
  );

  return (
    <Card
      className={cn(
        "h-48 w-full justify-center gap-1 bg-gradient-to-bl from-transparent from-20% to-[#25d865]/25 p-10 transition-all sm:w-[calc(100%-216px)]",
      )}>
      <Link
        href="/spotify"
        target="_blank"
        className="absolute top-3 right-3 size-7"
        title="go to my spotify profile">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path
            fill="#25d865"
            d="M16 0C7.197 0 0 7.197 0 16s7.197 16 16 16s16-7.197 16-16S24.88 0 16 0m7.36 23.12c-.319.479-.881.64-1.36.317c-3.76-2.317-8.479-2.797-14.083-1.52c-.557.165-1.037-.235-1.199-.72c-.156-.557.24-1.036.719-1.197c6.084-1.36 11.365-.803 15.521 1.76c.563.24.64.88.401 1.36zm1.921-4.401c-.401.563-1.12.803-1.683.401c-4.317-2.641-10.88-3.437-15.916-1.839c-.641.156-1.365-.161-1.521-.803c-.161-.64.156-1.359.797-1.52c5.844-1.761 13.041-.876 18 2.161c.484.24.724 1.041.323 1.599zm.162-4.479c-5.125-3.043-13.683-3.36-18.563-1.839c-.801.239-1.599-.24-1.839-.964c-.239-.797.24-1.599.959-1.839c5.683-1.681 15.041-1.359 20.964 2.161c.719.401.957 1.36.557 2.079c-.401.563-1.36.801-2.079.401z"
          />
        </svg>
      </Link>

      {data ? (
        <>
          <div className="flex items-center gap-2">
            <EqualizerAnimatedIcon />

            {!isCurrentlyPlaying ? (
              <span className="text-neutral-500">Offline. Recently played</span>
            ) : (
              <span className="text-neutral-500">Currently playing</span>
            )}
          </div>

          <Link
            href={song?.external_urls?.spotify ?? "#"}
            target="_blank"
            title={`open ${song?.name} by ${artistsName} in spotify web player`}
            className="line-clamp-1 w-fit text-2xl font-bold">
            {song?.name}
          </Link>

          <div className="line-clamp-1 w-fit text-lg font-semibold text-neutral-500">
            {artists?.map(artist => (
              <Fragment key={artist.id}>
                <Link
                  href={artist.external_urls?.spotify ?? "#"}
                  title={`go to ${artist.name} spotify page`}
                  className="group">
                  {artist.name}
                </Link>

                <span className="last:hidden">{", "}</span>
              </Fragment>
            ))}
          </div>
        </>
      ) : (
        <div
          className={cn(
            "flex flex-1 flex-col justify-center gap-1",
            isLoading && "*:animate-pulse *:blur-sm",
          )}>
          <div className="flex items-center gap-2">
            <EqualizerAnimatedIcon notAnimated />

            {isLoading && (
              <span className="text-neutral-500">Currently playing</span>
            )}
          </div>

          <span className="line-clamp-1 text-2xl font-bold">
            Not currently playing
          </span>
          <span className="line-clamp-1 text-lg font-semibold text-neutral-500">
            Spotify
          </span>
        </div>
      )}
    </Card>
  );
};
