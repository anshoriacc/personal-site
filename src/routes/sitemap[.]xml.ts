import { createFileRoute } from '@tanstack/react-router'
import { allPosts } from 'content-collections'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = process.env.SITE_URL || 'https://anshori.com'

        const blogUrls = allPosts
          .filter((post) => post.published)
          .map(
            (post) => `
          <url>
            <loc>${baseUrl}/blog/${post.slug}</loc>
            <lastmod>${post.date.toISOString().split('T')[0]}</lastmod>
            <priority>0.6</priority>
          </url>`,
          )
          .join('')

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
    <loc>${baseUrl}/blog</loc>
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
  ${blogUrls}
</urlset>`

        return new Response(sitemap.trim(), {
          headers: {
            'Content-Type': 'application/xml',
          },
        })
      },
    },
  },
})
