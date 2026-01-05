import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: async () => {
        const checks = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
        }

        return Response.json(checks)
      },
    },
  },
})
