import { type PropsWithChildren, useEffect } from 'react'
import { useThemeStore } from '@/stores/theme.store'
import { type TTheme } from '@/lib/theme'

type Props = PropsWithChildren<{ theme: TTheme }>

export function Providers({ children, theme }: Props) {
  useEffect(() => {
    useThemeStore.getState().initTheme(theme)
  }, [theme])

  return <>{children}</>
}
