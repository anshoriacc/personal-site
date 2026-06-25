import React from 'react'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Providers } from '../components/providers'
import { getThemeServerFn } from '../server/theme'
import appCss from '../styles.css?url'

import { cn } from '@/lib/utils'
import { createPageMeta } from '@/lib/seo'
import { useMounted } from '@/hooks/use-mounted'
import { useDeferredScript } from '@/hooks/use-deferred-script'
import { useIsNightTime } from '@/stores/time.store'
import { NotFound } from '@/components/not-found'
import {
  ThemeDetectionScript,
  BodySelectionScript,
} from '@/components/inline-scripts'
import { ThemeHotkey } from '@/components/theme-hotkey'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: () => getThemeServerFn(),
    head: () => {
      const siteUrl = process.env.SITE_URL || 'https://anshori.com'
      const { meta, links } = createPageMeta({ path: '/' })

      return {
        meta: [
          { charSet: 'UTF-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          {
            name: 'theme-color',
            media: '(prefers-color-scheme: light)',
            content: '#ffffff',
          },
          {
            name: 'theme-color',
            media: '(prefers-color-scheme: dark)',
            content: '#252525',
          },
          { name: 'author', content: 'Achmad Anshori' },
          {
            name: 'keywords',
            content:
              'Achmad Anshori, Software Engineer, Web Developer, React, TypeScript, TanStack, Jakarta, Indonesia, Full Stack Developer',
          },
          ...meta,
        ],
        links: [
          { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
          { rel: 'apple-touch-icon', href: '/dark192.png' },
          { rel: 'manifest', href: '/manifest.json' },
          { rel: 'preconnect', href: 'https://analytics.anshori.com' },
          { rel: 'dns-prefetch', href: 'https://analytics.anshori.com' },
          {
            rel: 'stylesheet',
            href: appCss,
          },
          ...links,
        ],
        scripts: [
          {
            children:
              'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()',
          },
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Achmad Anshori',
              url: siteUrl,
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
      }
    },
    shellComponent: RootDocument,
    notFoundComponent: () => <NotFound />,
  },
)

function RootDocument({ children }: { children: React.ReactNode }) {
  const mounted = useMounted()
  const theme = Route.useLoaderData()
  const isNight = useIsNightTime()

  // Defer analytics loading until after hydration
  useDeferredScript({
    src: 'https://analytics.anshori.com/js/pa-p0NwZyekqcSY7WVXGto9a.js',
    defer: false,
    async: true,
  })

  const selectionClasses = mounted
    ? !isNight
      ? 'selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-200'
      : 'selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-200'
    : 'selection:bg-neutral-200 selection:text-neutral-900 dark:selection:bg-neutral-900 dark:selection:text-neutral-200'

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body
        className={cn(
          'relative w-screen cursor-default overflow-x-hidden overflow-y-visible',
          selectionClasses,
        )}
      >
        <Providers theme={theme}>{children}</Providers>
        <TanStackDevtools
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <ThemeDetectionScript />
        {mounted ? <BodySelectionScript /> : null}
        <ThemeHotkey />
        <Scripts />
      </body>
    </html>
  )
}
