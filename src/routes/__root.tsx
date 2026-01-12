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
import { useIsNightTime } from '@/stores/time.store'
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

        <BodySelectionScript />

        <Scripts />
      </body>
    </html>
  )
}

const BodySelectionScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(${(() => {
        const t = new Date()
        const fullHours = t.getHours()
        const isNight = fullHours >= 18 || fullHours < 4

        const baseClasses =
          'relative w-screen cursor-default overflow-x-hidden overflow-y-visible'
        const selectionClasses = isNight
          ? 'selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-200'
          : 'selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-200'

        document.body.className = baseClasses + ' ' + selectionClasses
      }).toString()})()`,
    }}
  />
)
