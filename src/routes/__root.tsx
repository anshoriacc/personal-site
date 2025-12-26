import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { Providers } from '../components/providers'
import { getThemeServerFn } from '../lib/theme'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
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
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div>404 Not Found</div>,
})

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
              position: 'bottom-left',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </Providers>
        <Scripts />
      </body>
    </html>
  )
}
