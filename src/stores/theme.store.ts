import { create } from 'zustand'
import { setThemeServerFn, type TTheme } from '@/server/theme'

interface ThemeStore {
  theme: TTheme
  override: TTheme | null
  toggleTheme: () => Promise<void>
  initTheme: (theme: TTheme, override: TTheme | null) => void
}

type TResolvedTheme = TTheme

function createTransitionDisablingStylesheet(): HTMLStyleElement {
  const css = document.createElement('style')
  css.type = 'text/css'
  css.appendChild(
    document.createTextNode(
      `*, *::before, *::after {
        transition: none !important;
      }`,
    ),
  )
  return css
}

function disableTransitions(): HTMLStyleElement {
  const css = createTransitionDisablingStylesheet()
  document.head.appendChild(css)
  return css
}

function enableTransitions(css: HTMLStyleElement): void {
  window.getComputedStyle(css).opacity
  document.head.removeChild(css)
}

export function applyTheme(resolvedTheme: TResolvedTheme) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  const transitionsDisabled = disableTransitions()
  html.classList.remove('light', 'dark')
  html.classList.add(resolvedTheme)
  enableTransitions(transitionsDisabled)
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
  override: null,

  initTheme: (theme, override) => {
    set({ theme, override })
  },

  toggleTheme: async () => {
    const theme = useThemeStore.getState().theme === 'dark' ? 'light' : 'dark'
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light'
    const override = theme === systemTheme ? null : theme
    set({ theme, override })
    applyTheme(theme)

    try {
      await setThemeServerFn({ data: override })
    } catch (error) {
      console.error('Failed to persist theme:', error)
    }
  },
}))

export const useTheme = () => useThemeStore((state) => state.theme)
export const useToggleTheme = () => useThemeStore((state) => state.toggleTheme)
