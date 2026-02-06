import { type PropsWithChildren, useEffect } from 'react'
import { useThemeStore } from '@/stores/theme.store'
import { useTimeStore } from '@/stores/time.store'
import { type TTheme } from '@/server/theme'

type Props = PropsWithChildren<{ theme: TTheme }>

const getDOMTheme = (): TTheme | null => {
  if (typeof document === 'undefined') return null
  const htmlClass = document.documentElement.className
  if (htmlClass === 'light' || htmlClass === 'dark') {
    return htmlClass
  }
  return null
}

export function Providers({ children, theme }: Props) {
  useEffect(() => {
    const domTheme = getDOMTheme()

    const themeToUse = domTheme ?? theme

    useThemeStore.getState().initTheme(themeToUse)
    useTimeStore.getState().updateTime()
  }, [theme])

  return <>{children}</>
}
