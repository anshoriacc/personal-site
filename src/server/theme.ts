import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

const themeValidator = z.union([z.literal('light'), z.literal('dark')])
export type TTheme = z.infer<typeof themeValidator>

const THEME_COOKIE = '_preferred-theme'
export const getThemeServerFn = createServerFn().handler(
  () => themeValidator.safeParse(getCookie(THEME_COOKIE)).data ?? null,
)

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .validator(themeValidator.nullable())
  .handler(({ data }) => {
    if (data === null) {
      setCookie(THEME_COOKIE, '', { maxAge: 0 })
    } else {
      setCookie(THEME_COOKIE, data)
    }
    return data
  })
