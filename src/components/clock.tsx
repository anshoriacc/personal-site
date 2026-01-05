'use client'

import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import {
  useHourRotation,
  useIsNightTime,
  useMinuteRotation,
  useTimeStore,
} from '@/stores/time.store'

type Props = {
  className?: string
}

export const Clock = ({ className }: Props) => {
  const updateTime = useTimeStore((state) => state.updateTime)
  const isNight = useIsNightTime()
  const hourRotation = useHourRotation()
  const minuteRotation = useMinuteRotation()

  useEffect(() => {
    // Update immediately on mount to sync with current time
    updateTime()
    
    const timer = setInterval(() => updateTime(), 10)
    return () => clearInterval(timer)
  }, [updateTime])

  return (
    <svg viewBox="0 0 100 100" className={cn('size-7', className)}>
      <circle
        cx="50"
        cy="50"
        r="50"
        fill="currentColor"
        className={cn(
          isNight
            ? 'fill-sky-400 dark:fill-sky-600'
            : 'fill-amber-400 dark:fill-amber-500'
        )}
      />
      <circle cx="50" cy="50" r="2" fill="currentColor" />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="30"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        transform={`rotate(${hourRotation}, 50, 50)`}
      />
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        transform={`rotate(${minuteRotation}, 50, 50)`}
      />
    </svg>
  )
}

