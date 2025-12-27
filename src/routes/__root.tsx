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
import { Header } from '@/components/header'
import appCss from '../styles.css?url'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    loader: () => getThemeServerFn(),
    head: () => ({
      meta: [
        {
          title: 'Achmad Anshori',
        },
        { name: 'description', content: 'Achmad Anshori Personal Website' },
        { property: 'og:title', content: 'Achmad Anshori' },
        {
          property: 'og:description',
          content: 'Achmad Anshori Personal Website',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://anshori.com' },
        {
          property: 'og:image',
          content: 'https://anshori.com/og-image.png',
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
  const constraintsRef = React.useRef<HTMLBodyElement>(null!)

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>

      <body ref={constraintsRef}>
        <Providers theme={theme}>
          <Header constraintsRef={constraintsRef} />

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
