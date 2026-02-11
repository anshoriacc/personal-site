import React from 'react'
import type { TTheme } from '@/server/theme'
import { useThemeStore } from '@/stores/theme.store'
import { useTimeStore } from '@/stores/time.store'

type Props = React.PropsWithChildren<{ theme: TTheme }>

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

    const themeToUse = domTheme ?? theme

    useThemeStore.getState().initTheme(themeToUse)
    useTimeStore.getState().updateTime()
  }, [theme])

  return <>{children}</>
}
