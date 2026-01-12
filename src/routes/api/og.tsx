import { createFileRoute } from '@tanstack/react-router'
import { ImageResponse } from '@vercel/og'

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url)
        const title = url.searchParams.get('title')
        const subtitle = url.searchParams.get('subtitle')

        return new ImageResponse(
          <div tw="flex p-2 bg-white w-full h-full">
            <div
              style={{
                background:
                  'radial-gradient(ellipse at 10% 10%, #666 0%, #000 100%)',
              }}
              tw="relative flex w-full h-full rounded-3xl p-2"
            >
              {title && (
                <div tw="flex flex-col items-center justify-center text-center w-full">
                  <span tw="text-white text-4xl font-semibold">{title}</span>
                  {subtitle && (
                    <span tw="text-neutral-300 text-2xl mt-2">{subtitle}</span>
                  )}
                </div>
              )}

              <div tw="absolute bottom-8 right-8 flex items-center">
                <div tw="flex flex-col text-neutral-300 justify-center items-end">
                  <span tw="text-white text-3xl">anshori</span>
                  <span tw="text-xl">Software Engineer</span>
                </div>
              </div>

              <div
                tw="absolute inset-0"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.5%22 numOctaves=%223%22 result=%22noise%22 /%3E%3CfeColorMatrix in=%22noise%22 type=%22saturate%22 values=%220%22 /%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23000%22 filter=%22url(%23noise)%22 opacity=%220.15%22 /%3E%3C/svg%3E")',
                  backgroundSize: '600px 600px',
                }}
              />
            </div>
          </div>,
          {
            width: 800,
            height: 420,
          },
        )
      },
    },
  },
})
