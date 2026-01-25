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

import { cn } from '@/lib/utils'
import { getThemeServerFn } from '../server/theme'
import { useIsNightTime } from '@/stores/time.store'
import { Providers } from '../components/providers'
import { NotFound } from '@/components/not-found'
import { SITE_URL } from '../constants/env'
import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: () => getThemeServerFn(),
    head: () => ({
      meta: [
        { charSet: 'UTF-8' },
        {
          title: 'Achmad Anshori',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Software Engineer based in Jakarta, Indonesia.',
        },
        { name: 'author', content: 'Achmad Anshori' },
        {
          name: 'keywords',
          content:
            'Achmad Anshori, Software Engineer, Web Developer, React, TypeScript, TanStack, Jakarta, Indonesia, Full Stack Developer',
        },
        { name: 'theme-color', content: '#000000' },
        { property: 'og:title', content: 'Achmad Anshori' },
        {
          property: 'og:description',
          content: 'Software Engineer based in Jakarta, Indonesia.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        {
          property: 'og:url',
          content: SITE_URL,
        },
        {
          property: 'og:image',
          content: `${SITE_URL}/api/og`,
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
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
          name: 'twitter:creator',
          content: '@20arik_',
        },
        {
          name: 'twitter:image',
          content: `${SITE_URL}/api/og`,
        },
      ],
      links: [
        { rel: 'icon', href: '/dark192.png' },
        { rel: 'apple-touch-icon', href: '/dark192.png' },
        { rel: 'canonical', href: SITE_URL },
        { rel: 'preconnect', href: 'https://umami.anshori.com' },
        { rel: 'dns-prefetch', href: 'https://umami.anshori.com' },
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
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Achmad Anshori',
            url: SITE_URL,
            jobTitle: 'Software Engineer',
            description: 'Software Engineer based in Jakarta, Indonesia.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Jakarta',
              addressCountry: 'Indonesia',
            },
            sameAs: [
              'https://github.com/anshoriacc',
              'https://linkedin.com/in/achmad-anshori',
              'https://x.com/20arik_',
            ],
          }),
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
