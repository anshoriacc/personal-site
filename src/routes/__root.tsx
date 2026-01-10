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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: () => getThemeServerFn(),
    head: () => ({
      meta: [
        {
          title: 'Achmad Anshori',
        },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Achmad Anshori Personal Website' },
        { property: 'og:title', content: 'Achmad Anshori' },
        {
          property: 'og:description',
          content: 'Achmad Anshori Personal Website',
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
          content: 'Achmad Anshori Personal Website',
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
    }),
    shellComponent: RootDocument,
    notFoundComponent: () => <div>404 Not Found</div>,
  },
)

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body>
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
      </body>
    </html>
  )
}
