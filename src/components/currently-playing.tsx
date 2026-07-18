import { IconBrandSpotifyFilled } from '@tabler/icons-react'
import { motion, useAnimationFrame, useMotionValue } from 'motion/react'
import { useEffect, useRef } from 'react'

import { useGetCurrentlyPlayingQuery } from '@/hooks/api/spotify'
import { cn } from '@/lib/utils'

export const CurrentlyPlaying = () => {
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

  const isNotShowing = !song && !artists && !artistsName

  const vinylRef = useRef<HTMLDivElement>(null)
  const rotation = useMotionValue(0)
  const isDragging = useRef(false)
  const prevAngle = useRef(0)
  const lastTime = useRef(0)
  const dragVelocity = useRef(0)

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isDragging.current = false
    }
    window.addEventListener('pointerup', handleGlobalPointerUp)
    window.addEventListener('pointercancel', handleGlobalPointerUp)
    window.addEventListener('blur', handleGlobalPointerUp)

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp)
      window.removeEventListener('pointercancel', handleGlobalPointerUp)
      window.removeEventListener('blur', handleGlobalPointerUp)
    }
  }, [])

  useAnimationFrame((_, delta) => {
    if (
      !isDragging.current &&
      !isNotShowing &&
      !currentlyPlayingQuery.isLoading
    ) {
      dragVelocity.current *= Math.pow(0.92, delta / 16.66)

      if (Math.abs(dragVelocity.current) < 0.1) {
        dragVelocity.current = 0
      }

      const currentSpeed = 60 + dragVelocity.current
      rotation.set(rotation.get() + (delta / 1000) * currentSpeed)
    }
  })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = vinylRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    prevAngle.current =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
    lastTime.current = performance.now()
    dragVelocity.current = 0
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return
    const rect = vinylRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const currentAngle =
      Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)

    let frameDiff = currentAngle - prevAngle.current
    if (frameDiff > 180) frameDiff -= 360
    if (frameDiff < -180) frameDiff += 360

    rotation.set(rotation.get() + frameDiff)

    const now = performance.now()
    const dt = (now - lastTime.current) / 1000 // seconds
    if (dt > 0) {
      dragVelocity.current = frameDiff / dt
    }

    prevAngle.current = currentAngle
    lastTime.current = now
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch (err) {}

    if (performance.now() - lastTime.current > 100) {
      dragVelocity.current = 0
    }
  }

  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-10">
      <div className="group relative flex size-20 items-center select-none">
        {/* vinyl */}
        <div className="absolute left-[55%] aspect-square size-[90%] rounded-full shadow-md transition-all group-hover:left-[65%]">
          <motion.div
            ref={vinylRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={cn(
              'absolute inset-0 cursor-grab rounded-full ring-1 ring-black/10 ring-inset active:cursor-grabbing dark:ring-white/10',
              'will-change-transform',
              (isNotShowing || currentlyPlayingQuery.isLoading) && 'grayscale',
            )}
            style={{
              rotate: rotation,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"), repeating-radial-gradient(circle, #18181b 0, #09090b 1px, #18181b 2px)`,
            }}
          >
            <div className="absolute inset-1 rounded-full border border-white/5" />
            <div className="absolute inset-3 rounded-full border border-white/5" />
            <div className="absolute inset-5 rounded-full border border-white/5" />

            <div className="absolute inset-0 m-auto aspect-square w-1/3 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10">
              {isNotShowing ? (
                <div className="size-full bg-neutral-600" />
              ) : (
                <img
                  src={song?.album?.images?.[0]?.url}
                  alt={song?.album?.name}
                  draggable={false}
                  className="size-full bg-neutral-600 object-cover"
                />
              )}

              <div
                className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="bg-background absolute inset-0 m-auto aspect-square w-1 rounded-full ring-1 ring-black/10 ring-inset dark:ring-white/10" />
          </motion.div>

          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-50 mix-blend-screen"
            style={{
              background:
                'conic-gradient(from 150deg, transparent 0%, rgba(255,255,255,0.2) 5%, transparent 10%, transparent 50%, rgba(255,255,255,0.2) 55%, transparent 60%)',
            }}
          />
        </div>

        {/* sleeve (album cover) */}
        <div
          className={cn(
            'bg-background relative z-10 flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm p-px shadow-xl',
          )}
        >
          {isNotShowing ? (
            <IconBrandSpotifyFilled className="text-muted size-12" />
          ) : (
            <div className="relative">
              <img
                src={song?.album?.images?.[0]?.url}
                alt={song?.album?.name}
                draggable={false}
                className={cn(
                  'size-full rounded-[5px] bg-neutral-400 object-cover dark:bg-neutral-600',
                  'box-border border bg-clip-padding backdrop-blur-md backdrop-brightness-100 backdrop-saturate-100',
                )}
              />

              <IconBrandSpotifyFilled className="absolute bottom-1 left-1 size-4 text-[#25d865]" />
            </div>
          )}
        </div>
      </div>

      {song && artists && artistsName ? (
        <div className="flex w-full flex-col justify-center">
          <span className="text-muted-foreground text-sm">
            {isCurrentlyPlaying
              ? 'Currently playing'
              : 'Offline. Recently played'}
          </span>
          <a
            href={song?.external_urls?.spotify ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            title={`open ${song?.name} by ${artistsName} in spotify web player`}
            className="cursor-external-link line-clamp-1 w-fit hover:underline"
          >
            {song?.name}
          </a>
          <span className="text-muted-foreground line-clamp-1">
            {artists?.map((artist: any, index: number) => (
              <span key={artist.id ?? artist.name}>
                <a
                  href={artist.external_urls?.spotify ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`open ${artist.name} in spotify web player`}
                  className="cursor-external-link hover:underline"
                >
                  {artist.name}
                </a>
                {index < artists.length - 1 && ', '}
              </span>
            ))}
          </span>
        </div>
      ) : (
        <div
          className={cn(
            'flex w-full flex-col justify-center',
            currentlyPlayingQuery.isLoading && '*:animate-pulse *:blur-sm',
          )}
        >
          <span className="text-muted-foreground text-sm">Spotify</span>
          <span className="line-clamp-1">Not currently playing</span>
        </div>
      )}
    </div>
  )
}
