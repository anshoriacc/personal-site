import { create } from 'zustand'
import { setThemeServerFn, type TTheme } from '@/server/theme'

interface ThemeStore {
  theme: TTheme
  setTheme: (theme: TTheme) => Promise<void>
  initTheme: (theme: TTheme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'dark',

  initTheme: (theme) => {
    set({ theme })
  },

  setTheme: async (theme) => {
    set({ theme })
    if (typeof document !== 'undefined') {
      document.documentElement.className = theme
    }

    try {
      await setThemeServerFn({ data: theme })
    } catch (error) {
      console.error('Failed to persist theme:', error)
    }
  },
}))

export const useTheme = () => useThemeStore((state) => state.theme)
export const useSetTheme = () => useThemeStore((state) => state.setTheme)
