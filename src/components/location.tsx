import { useEffect, useRef, useState } from 'react'
import createGlobe from 'cobe'
import { animate, MotionValue, motionValue } from 'motion/react'

import { cn } from '@/lib/utils'
import { useTheme } from '@/stores/theme.store'
import { useIsNightTime } from '@/stores/time.store'

type Props = {
  className?: string
}

// Jakarta, Indonesia coordinates
const JAKARTA_LAT = -6.2088
const JAKARTA_LONG = 106.8456

// Convert lat/long to globe phi/theta angles
const locationToAngles = (lat: number, long: number): [number, number] => {
  return [
    Math.PI - ((long * Math.PI) / 180 - Math.PI / 2), // phi
    (lat * Math.PI) / 180, // theta
  ]
}

// Convert CSS color to RGB array for Cobe (values 0-1)
const getCSSVariableRGB = (variable: string): [number, number, number] => {
  const root = document.documentElement
  const value = getComputedStyle(root).getPropertyValue(variable).trim()

  // Handle oklch format: oklch(L C H)
  if (value.startsWith('oklch')) {
    const match = value.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/)
    if (match) {
      const lightness = parseFloat(match[1])
      return [lightness, lightness, lightness]
    }
  }

  // Fallback
  return [0.5, 0.5, 0.5]
}

export const Location = ({ className }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const bounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  )
  const globeRef = useRef<any>(null)

  const theme = useTheme()
  const isNightTime = useIsNightTime()

  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 240 })

  // Motion value for smooth drag and bounce-back
  const r = useRef<MotionValue<number>>(motionValue(0))

  // Get Jakarta center angles
  const [jakartaPhi, jakartaTheta] = locationToAngles(JAKARTA_LAT, JAKARTA_LONG)

  useEffect(() => {
    if (!canvasRef.current) return

    // Resize observer for responsive canvas
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

    const markerColor: [number, number, number] = isNightTime
      ? [0.22, 0.66, 0.9] // sky-500
      : [0.96, 0.59, 0.11] // amber-500

    const backgroundRGB = getCSSVariableRGB('--muted-foreground')

    const glowColor: [number, number, number] =
      theme === 'dark' ? [0.2, 0.2, 0.2] : [0.8, 0.8, 0.8]

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: canvasSize.width,
      height: canvasSize.height,
      phi: jakartaPhi,
      theta: jakartaTheta - 0.3,
      dark: theme === 'dark' ? 1 : 0,
      diffuse: 0,
      scale: 2.3,
      offset: [0, canvasSize.width / 4.5],
      mapSamples: 60000,
      mapBrightness: 3,
      baseColor: backgroundRGB,
      markerColor,
      glowColor,
      markers: [{ location: [JAKARTA_LAT, JAKARTA_LONG], size: 0.1 }],
      opacity: 1,
      onRender: (state) => {
        state.width = canvasSize.width
        state.height = canvasSize.height

        state.phi = jakartaPhi + r.current.get()

        const isDark = theme === 'dark'
        state.dark = isDark ? 1 : 0
        state.mapBrightness = 3
      },
    })

    globeRef.current = globe

    return () => {
      globe.destroy()
      resizeObserver.disconnect()
      if (bounceTimeoutRef.current) {
        clearTimeout(bounceTimeoutRef.current)
      }
    }
  }, [theme, isNightTime, canvasSize.width, canvasSize.height, jakartaPhi])

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing'
    }

    if (bounceTimeoutRef.current) {
      clearTimeout(bounceTimeoutRef.current)
    }
  }

  const handlePointerUp = () => {
    pointerInteracting.current = null
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab'
    }

    bounceTimeoutRef.current = setTimeout(() => {
      animate(r.current, 0, {
        type: 'spring',
        stiffness: 280,
        damping: 40,
        mass: 1,
      })
    }, 2000)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
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

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        'opacity-30 transition-opacity duration-300 hover:opacity-100',
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
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, var(--background) 100%)`,
        }}
      />
    </div>
  )
}
