import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'
import { blog } from './plugins/blog.ts'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    // MDX importers are not covered by TypeScript path resolution in SSR builds.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  plugins: [
    devtools({ eventBusConfig: { port: 42042 } }),
    nitro(),
    tailwindcss(),
    blog(),
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeShiki,
          {
            theme: 'vesper',
            colorReplacements: {
              '#101010': 'var(--code-background)',
              '#fff': 'var(--foreground)',
              '#ffff': 'var(--foreground)',
              '#a0a0a0': 'var(--muted-foreground)',
              '#8b8b8b94': 'var(--muted-foreground)',
              '#ffc799': 'var(--code-accent)',
              '#99ffe4': 'var(--code-string)',
              '#ff8080': 'var(--destructive)',
              '#65737e': 'var(--muted-foreground)',
              '#00000050': 'var(--muted-foreground)',
            },
          },
        ],
      ],
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
