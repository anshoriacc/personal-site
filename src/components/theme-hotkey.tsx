import { useHotkey } from '@tanstack/react-hotkeys'
import { useSetTheme, useTheme } from '@/stores/theme.store'

export const ThemeHotkey = () => {
  const theme = useTheme()
  const setTheme = useSetTheme()

  useHotkey('T', () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  })

  return null
}
