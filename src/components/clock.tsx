import { useEffect } from 'react'

import { cn } from '@/lib/utils'
import {
  useTimeStore,
  useIsNightTime,
  useHourRotation,
  useMinuteRotation,
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
    updateTime()

    const timer = setInterval(() => updateTime(), 10)
    return () => clearInterval(timer)
  }, [updateTime])

  return (
    <>
      <svg
        viewBox="0 0 100 100"
        className={cn('size-7 overflow-hidden rounded-md', className)}
      >
        <rect
          id="clock"
          x="0"
          y="0"
          width="100"
          height="100"
          fill="currentColor"
          className={cn(isNight ? 'fill-sky-500' : 'fill-amber-500')}
        />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <line
          id="hour-hand"
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
          id="minute-hand"
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

      <ClockScript />
    </>
  )
}

export const ClockScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(${(() => {
        const t = new Date()
        const h = t.getHours() % 12
        const m = t.getMinutes()
        const s = t.getSeconds()
        const fullHours = t.getHours()

        const hourEl = document.getElementById('hour-hand')
        const minuteEl = document.getElementById('minute-hand')
        const clockCircle = document.getElementById('clock')

        if (hourEl) {
          const hr = h * 30 + m * 0.5
          hourEl.setAttribute('transform', 'rotate(' + hr + ', 50, 50)')
        }

        if (minuteEl) {
          const mr = m * 6 + s * 0.1
          minuteEl.setAttribute('transform', 'rotate(' + mr + ', 50, 50)')
        }

        if (clockCircle) {
          const isNight = fullHours >= 18 || fullHours < 4
          const colorClass = isNight ? 'fill-sky-500' : 'fill-amber-500'
          clockCircle.setAttribute('class', colorClass)
        }
      }).toString()})()`,
    }}
  />
)
