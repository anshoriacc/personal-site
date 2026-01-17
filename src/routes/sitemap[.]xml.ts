import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = process.env.SITE_URL || 'https://anshori.com'

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${baseUrl}/</loc>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${baseUrl}/work</loc>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>${baseUrl}/vault/ellty</loc>
            <priority>0.7</priority>
        </url>
        <url>
            <loc>${baseUrl}/vault/tree-arithmetic</loc>
            <priority>0.7</priority>
        </url>
        </urlset>`

        return new Response(sitemap, {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
