import React from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { type QueryClient } from '@tanstack/react-query'

import { Providers } from '../components/providers'
import { getThemeServerFn } from '../server/theme'
import appCss from '../styles.css?url'
import { SITE_URL } from '../constants/env'
import { cn } from '@/lib/utils'
import { useIsNightTime, useTimeStore } from '@/stores/time.store'
import { NotFound } from '@/components/not-found'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: () => getThemeServerFn(),
    head: () => ({
      meta: [
        {
          title: 'Achmad Anshori',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:title', content: 'Achmad Anshori' },
        {
          name: 'description',
          content: 'Software Engineer based in Jakarta, Indonesia.',
        },
        {
          property: 'og:description',
          content: 'Software Engineer based in Jakarta, Indonesia.',
        },
        { property: 'og:type', content: 'website' },
        {
          property: 'og:url',
          content: SITE_URL,
        },
        {
          property: 'og:image',
          content: `${SITE_URL}/api/og`,
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Achmad Anshori' },
        {
          name: 'twitter:description',
          content: 'Software Engineer based in Jakarta, Indonesia.',
        },
        {
          name: 'twitter:url',
          content: SITE_URL,
        },
        {
          name: 'twitter:creator:id',
          content: '@20arik_',
        },
        {
          name: 'twitter:image',
          content: `${SITE_URL}/api/og`,
        },
      ],
      links: [
        { rel: 'icon', href: '/logo192.png' },
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
      scripts: [
        {
          defer: true,
          src: 'https://umami.anshori.com/script.js',
          'data-website-id': 'a35702fc-4b2e-4e45-b6c7-a93b8d273540',
        },
      ],
    }),
    shellComponent: RootDocument,
    notFoundComponent: () => <NotFound />,
  },
)

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()
  const isNight = useIsNightTime()

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body
        id="root-body"
        className={cn(
          'relative w-screen cursor-default overflow-x-hidden overflow-y-visible',
          !isNight
            ? 'selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-200'
            : 'selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-200',
        )}
      >
        <Providers theme={theme}>
          {children}

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />

          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Providers>
        <Scripts />
        <TimeInitScript />
      </body>
    </html>
  )
}

const TimeInitScript = () => {
  const updateTime = useTimeStore((state) => state.updateTime)

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${(() => {
          updateTime()
          // const t = new Date()
          // const h = t.getHours() % 12
          // const m = t.getMinutes()
          // const s = t.getSeconds()
          // const fullHours = t.getHours()
          // const isNight = fullHours >= 18 || fullHours < 4

          // // Update clock
          // const hourEl = document.getElementById('hour-hand')
          // const minuteEl = document.getElementById('minute-hand')
          // const clockCircle = document.getElementById('clock')

          // if (hourEl) {
          //   const hr = h * 30 + m * 0.5
          //   hourEl.setAttribute('transform', 'rotate(' + hr + ', 50, 50)')
          // }

          // if (minuteEl) {
          //   const mr = m * 6 + s * 0.1
          //   minuteEl.setAttribute('transform', 'rotate(' + mr + ', 50, 50)')
          // }

          // if (clockCircle) {
          //   const colorClass = isNight ? 'fill-sky-500' : 'fill-amber-500'
          //   clockCircle.setAttribute('class', colorClass)
          // }

          // // Update experience indicator
          // const pingEl = document.getElementById('exp-indicator-ping')
          // const dotEl = document.getElementById('exp-indicator-dot')

          // if (pingEl) {
          //   const pingClass = isNight ? 'bg-sky-400' : 'bg-amber-400'
          //   pingEl.className = pingEl.className.replace(
          //     /bg-(sky|amber)-400/,
          //     pingClass,
          //   )
          // }

          // if (dotEl) {
          //   const dotClass = isNight ? 'bg-sky-500' : 'bg-amber-500'
          //   dotEl.className = dotEl.className.replace(
          //     /bg-(sky|amber)-500/,
          //     dotClass,
          //   )
          // }

          // // Update body selection colors
          // const bodyEl = document.getElementById('root-body')
          // if (bodyEl) {
          //   const selectionClasses = isNight
          //     ? 'selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-200'
          //     : 'selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-200'

          //   // Remove old selection classes
          //   bodyEl.className = bodyEl.className.replace(
          //     /selection:bg-(sky|amber)-\d+ selection:text-(sky|amber)-\d+ dark:selection:bg-(sky|amber)-\d+ dark:selection:text-(sky|amber)-\d+/g,
          //     selectionClasses,
          //   )
          // }
        }).toString()})()`,
      }}
    />
  )
}
