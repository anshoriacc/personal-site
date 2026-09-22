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
          { themes: { light: 'github-light', dark: 'github-dark' } },
        ],
      ],
    }),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
