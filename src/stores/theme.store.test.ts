import { beforeEach, expect, it, vi } from 'vitest'

import { setThemeServerFn } from '@/server/theme'
import { useThemeStore } from './theme.store'

vi.mock('@/server/theme', () => ({
  setThemeServerFn: vi.fn().mockResolvedValue(null),
}))

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false })),
  )
  useThemeStore.getState().initTheme('light', null)
})

it('stores an override only while selected theme differs from system', async () => {
  await useThemeStore.getState().toggleTheme()
  expect(useThemeStore.getState().override).toBe('dark')
  expect(setThemeServerFn).toHaveBeenLastCalledWith({ data: 'dark' })

  await useThemeStore.getState().toggleTheme()
  expect(useThemeStore.getState().override).toBeNull()
  expect(setThemeServerFn).toHaveBeenLastCalledWith({ data: null })
})

it('keeps an explicit override when system later matches it', async () => {
  await useThemeStore.getState().toggleTheme()
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: true })),
  )

  expect(useThemeStore.getState().override).toBe('dark')
  await useThemeStore.getState().toggleTheme()
  expect(useThemeStore.getState().override).toBe('light')
  expect(setThemeServerFn).toHaveBeenLastCalledWith({ data: 'light' })
})
