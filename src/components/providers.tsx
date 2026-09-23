import React from 'react'
import type { TTheme } from '@/server/theme'
import { applyTheme, useThemeStore } from '@/stores/theme.store'
import { useTimeStore } from '@/stores/time.store'

type Props = React.PropsWithChildren<{ theme: TTheme | null }>

const getDOMTheme = (): TTheme | null => {
  if (typeof document === 'undefined') return null
  const htmlClass = document.documentElement.className
  if (htmlClass === 'light' || htmlClass === 'dark') {
    return htmlClass
  }
  return null
}

export function Providers({ children, theme }: Props) {
  React.useEffect(() => {
    const domTheme = getDOMTheme()
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme = system.matches ? 'dark' : 'light'
    useThemeStore.getState().initTheme(domTheme ?? theme ?? systemTheme, theme)
    useTimeStore.getState().updateTime()

    const onSystemChange = (event: MediaQueryListEvent) => {
      if (useThemeStore.getState().override !== null) return
      const nextTheme = event.matches ? 'dark' : 'light'
      useThemeStore.getState().initTheme(nextTheme, null)
      applyTheme(nextTheme)
    }

    system.addEventListener('change', onSystemChange)
    return () => system.removeEventListener('change', onSystemChange)
  }, [theme])

  return <>{children}</>
}
