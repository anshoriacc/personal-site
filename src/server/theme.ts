import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

const themeValidator = z.union([z.literal('light'), z.literal('dark')])
export type TTheme = z.infer<typeof themeValidator>

const THEME_COOKIE = '_preferred-theme'
const DEFAULT_THEME: TTheme = 'dark'

export const getThemeServerFn = createServerFn().handler(
  () => (getCookie(THEME_COOKIE) || DEFAULT_THEME) as TTheme,
)

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(themeValidator)
  .handler(({ data }) => {
    setCookie(THEME_COOKIE, data)
    return data
  })
