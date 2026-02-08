import React from 'react'
import createGlobe from 'cobe'
import { animate, MotionValue, motionValue } from 'motion/react'
import { HugeiconsIcon } from '@hugeicons/react'

import { cn } from '@/lib/utils'
import { useTheme } from '@/stores/theme.store'
import { useIsNightTime } from '@/stores/time.store'
import { MapPin } from '@hugeicons/core-free-icons'

type Props = {
  className?: string
}

const JAKARTA_LAT = -6.2088
const JAKARTA_LONG = 106.8456

const locationToAngles = (lat: number, long: number): [number, number] => {
  return [
    Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ]
}

const [JAKARTA_PHI, JAKARTA_THETA] = locationToAngles(JAKARTA_LAT, JAKARTA_LONG)

const MARKER_COLOR_NIGHT: [number, number, number] = [0.22, 0.66, 0.9]
const MARKER_COLOR_DAY: [number, number, number] = [0.96, 0.59, 0.11]
const BASE_COLOR_DARK: [number, number, number] = [0.2, 0.2, 0.2]
const BASE_COLOR_LIGHT: [number, number, number] = [0.8, 0.8, 0.8]

export const Location = ({ className }: Props) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const pointerInteracting = React.useRef<number | null>(null)
  const pointerInteractionMovement = React.useRef(0)
  const bounceTimeoutRef = React.useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined)
  const globeRef = React.useRef<ReturnType<typeof createGlobe> | null>(null)

  const theme = useTheme()
  const isNightTime = useIsNightTime()

  const [canvasSize, setCanvasSize] = React.useState({
    width: 600,
    height: 240,
  })

  const r = React.useRef<MotionValue<number>>(motionValue(0))

  const themeRef = React.useRef(theme)
  const isNightTimeRef = React.useRef(isNightTime)
  const canvasSizeRef = React.useRef(canvasSize)

  React.useEffect(() => {
    themeRef.current = theme
  }, [theme])

  React.useEffect(() => {
    isNightTimeRef.current = isNightTime
  }, [isNightTime])

  React.useEffect(() => {
    canvasSizeRef.current = canvasSize
  }, [canvasSize])

  React.useEffect(() => {
    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: canvasSize.width,
      height: canvasSize.height,
      phi: JAKARTA_PHI,
      theta: JAKARTA_THETA - 0.3,
      dark: theme === 'dark' ? 1 : 0,
      diffuse: 0,
      scale: 2.3,
      offset: [0, canvasSize.width / 4],
      mapSamples: 60000,
      mapBrightness: 3,
      baseColor: theme === 'dark' ? BASE_COLOR_DARK : BASE_COLOR_LIGHT,
      glowColor: theme === 'dark' ? BASE_COLOR_DARK : BASE_COLOR_LIGHT,
      markerColor: isNightTime ? MARKER_COLOR_NIGHT : MARKER_COLOR_DAY,
      markers: [{ location: [JAKARTA_LAT, JAKARTA_LONG], size: 0.1 }],
      opacity: 1,
      onRender: (state) => {
        const currentSize = canvasSizeRef.current
        state.width = currentSize.width
        state.height = currentSize.height

        state.phi = JAKARTA_PHI + r.current.get()

        const isDark = themeRef.current === 'dark'
        state.dark = isDark ? 1 : 0
        state.mapBrightness = 3
        state.baseColor = isDark ? BASE_COLOR_DARK : BASE_COLOR_LIGHT
        state.glowColor = isDark ? BASE_COLOR_DARK : BASE_COLOR_LIGHT
        state.markerColor = isNightTimeRef.current
          ? MARKER_COLOR_NIGHT
          : MARKER_COLOR_DAY
      },
    })

    globeRef.current = globe

    return () => {
      globe.destroy()
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    if (!canvasRef.current) return

    const updateSize = () => {
      if (canvasRef.current?.parentElement) {
        const width = canvasRef.current.parentElement.offsetWidth
        const height = width * 0.5
        setCanvasSize({ width, height })
      }
    }

    updateSize()
    const resizeObserver = new ResizeObserver(updateSize)
    if (canvasRef.current.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handlePointerDown = (e: PointerEvent) => {
      pointerInteracting.current =
        e.clientX - pointerInteractionMovement.current
      canvas.style.cursor = 'grabbing'

      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current)
      }
    }

    const handlePointerUp = () => {
      pointerInteracting.current = null
      canvas.style.cursor = 'grab'

      bounceTimeoutRef.current = setTimeout(() => {
        animate(r.current, 0, {
          type: 'spring',
          stiffness: 280,
          damping: 40,
          mass: 1,
        })
      }, 2000)
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current
        pointerInteractionMovement.current = delta
        r.current.set(delta / 200)
      }
    }

    const handlePointerOut = () => {
      if (pointerInteracting.current !== null) {
        handlePointerUp()
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown, { passive: true })
    canvas.addEventListener('pointerup', handlePointerUp, { passive: true })
    canvas.addEventListener('pointermove', handlePointerMove, { passive: true })
    canvas.addEventListener('pointerout', handlePointerOut, { passive: true })

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerout', handlePointerOut)
    }
  }, [])

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        'opacity-50 transition-opacity duration-500 hover:opacity-100',
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
        }}
        className="cursor-grab active:cursor-grabbing"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-1 h-2/5"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, var(--background) 100%)`,
        }}
      />
      <div className="pointer-events-none absolute bottom-0 z-2 flex w-full items-center justify-center gap-1 text-sm">
        <HugeiconsIcon icon={MapPin} className="text-muted-foreground size-4" />
        <span>Jakarta, Indonesia</span>
      </div>
    </section>
  )
}
