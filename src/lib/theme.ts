// import { createServerFn } from '@tanstack/react-start'
// import { getCookie, setCookie } from '@tanstack/react-start/server'
// import { z } from 'zod'

// const themeValidator = z.union([z.literal('light'), z.literal('dark')])
// export type Theme = z.infer<typeof themeValidator>

// const cookieName = '_preferred-theme'

// export const getThemeServerFn = createServerFn().handler(async () => {
//   const theme = getCookie(cookieName)
//   return (theme === 'light' || theme === 'dark' ? theme : 'light') as Theme
// })

// export const setThemeServerFn = createServerFn({ method: 'POST' })
//   .inputValidator(themeValidator)
//   .handler(async ({ data: theme }) => {
//     setCookie(cookieName, theme)
//     return theme
//   })

import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { z } from 'zod'

const postThemeValidator = z.union([z.literal('light'), z.literal('dark')])
export type T = z.infer<typeof postThemeValidator>
const storageKey = '_preferred-theme'

export const getThemeServerFn = createServerFn().handler(
  async () => (getCookie(storageKey) || 'light') as T,
)

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator(postThemeValidator)
  .handler(async ({ data }) => setCookie(storageKey, data))
