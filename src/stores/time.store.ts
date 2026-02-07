import { create } from 'zustand'

interface TimeStore {
  time: Date | null
  isNightTime: boolean
  hours: number
  minutes: number
  seconds: number
  hourRotation: number
  minuteRotation: number
  updateTime: () => void
}

const checkIsNightTime = (hours: number) => hours >= 18 || hours < 4

const calculateState = (time: Date) => {
  const fullHours = time.getHours()
  const hours = fullHours % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()

  return {
    time,
    isNightTime: checkIsNightTime(fullHours),
    hours,
    minutes,
    seconds,
    hourRotation: hours * 30 + minutes * 0.5,
    minuteRotation: minutes * 6 + seconds * 0.1,
  }
}

const defaultState = {
  time: null,
  isNightTime: false,
  hours: 0,
  minutes: 0,
  seconds: 0,
  hourRotation: 0,
  minuteRotation: 0,
}

export const useTimeStore = create<TimeStore>((set) => ({
  ...defaultState,
  updateTime: () => set(calculateState(new Date())),
}))

export const useIsNightTime = () => useTimeStore((state) => state.isNightTime)
export const useHourRotation = () => useTimeStore((state) => state.hourRotation)
export const useMinuteRotation = () =>
  useTimeStore((state) => state.minuteRotation)
export const useCurrentTime = () => useTimeStore((state) => state.time)
