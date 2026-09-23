import { useHotkey } from '@tanstack/react-hotkeys'
import { useToggleTheme } from '@/stores/theme.store'

export const ThemeHotkey = () => {
  const toggleTheme = useToggleTheme()

  useHotkey('T', toggleTheme)

  return null
}
