import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const baseUrl = process.env.SITE_URL || 'https://anshori.com'
        const lastmod = new Date().toISOString().split('T')[0]

        const urls = [
          { loc: '/', priority: '1.0', changefreq: 'weekly' },
          { loc: '/work', priority: '0.8', changefreq: 'monthly' },
          { loc: '/vault/ellty', priority: '0.7', changefreq: 'monthly' },
          {
            loc: '/vault/tree-arithmetic',
            priority: '0.7',
            changefreq: 'monthly',
          },
        ]

        const urlEntries = urls
          .map(
            (url) => `  <url>
                          <loc>${baseUrl}${url.loc}</loc>
                          <lastmod>${lastmod}</lastmod>
                          <changefreq>${url.changefreq}</changefreq>
                          <priority>${url.priority}</priority>
                        </url>
            `,
          )
          .join('\n')

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
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
