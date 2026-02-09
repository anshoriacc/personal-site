import { create } from 'zustand'
import { setThemeServerFn, type TTheme } from '@/server/theme'

interface ThemeStore {
  theme: TTheme
  setTheme: (theme: TTheme) => Promise<void>
  initTheme: (theme: TTheme) => void
}

const getInitialTheme = (): TTheme => {
  if (typeof document === 'undefined') return 'dark'
  const htmlClass = document.documentElement.className
  if (htmlClass === 'light' || htmlClass === 'dark') {
    return htmlClass
  }
  return 'dark'
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),

  initTheme: (theme) => {
    set({ theme })
  },

  setTheme: async (theme) => {
    // Apply theme synchronously for immediate visual feedback
    if (typeof document !== 'undefined') {
      document.documentElement.className = theme
    }

    // Use React's startTransition for state update to keep it smooth
    const React = await import('react')
    React.startTransition(() => {
      set({ theme })
    })

    try {
      await setThemeServerFn({ data: theme })
    } catch (error) {
      console.error('Failed to persist theme:', error)
    }
  },
}))

export const useTheme = () => useThemeStore((state) => state.theme)
export const useSetTheme = () => useThemeStore((state) => state.setTheme)
