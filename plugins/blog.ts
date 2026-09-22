import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import type { Plugin } from 'vite'
import type { TBlogPost } from '../src/lib/blog-types.ts'

const moduleId = 'virtual:blog'
const resolvedModuleId = `\0${moduleId}`
const frontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  date: z.iso.date(),
  draft: z.boolean().default(false),
})

export function parsePost(source: string, filename: string): TBlogPost | null {
  const slug = path.basename(filename, '.mdx')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${filename}: use a lowercase, hyphenated filename`)
  }

  const result = frontmatterSchema.safeParse(matter(source).data)
  if (!result.success) {
    throw new Error(
      `${filename}: invalid blog frontmatter: ${result.error.message}`,
    )
  }
  if (result.data.draft) return null

  const { title, description, date } = result.data
  return { slug, title, description, date }
}

export async function readPosts(directory: string): Promise<Array<TBlogPost>> {
  const files = await readdir(directory)
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) =>
        parsePost(await readFile(path.join(directory, file), 'utf8'), file),
      ),
  )
  return posts
    .filter((post) => post !== null)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
    )
}

export function blog(): Plugin {
  let directory: string

  return {
    name: 'blog-content',
    configResolved(config) {
      directory = path.join(config.root, 'src/content/blog')
    },
    resolveId(id) {
      if (id === moduleId) return resolvedModuleId
    },
    async load(id) {
      if (id !== resolvedModuleId) return
      const posts = await readPosts(directory)
      for (const post of posts) {
        this.addWatchFile(path.join(directory, `${post.slug}.mdx`))
      }
      // Only published files enter the module graph; drafts stay out of bundles.
      const loaders = posts.map(
        ({ slug }) =>
          `${JSON.stringify(slug)}: () => import(${JSON.stringify(`/src/content/blog/${slug}.mdx`)})`,
      )
      return `export const posts = ${JSON.stringify(posts)};\nexport const postLoaders = {${loaders.join(',')}};`
    },
    configureServer(server) {
      const refresh = (file: string) => {
        if (path.dirname(file) !== directory || !file.endsWith('.mdx')) return
        // Invalidate client and SSR copies when metadata or publication changes.
        for (const environment of Object.values(server.environments)) {
          const module = environment.moduleGraph.getModuleById(resolvedModuleId)
          if (module) environment.moduleGraph.invalidateModule(module)
        }
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(directory)
      server.watcher
        .on('add', refresh)
        .on('change', refresh)
        .on('unlink', refresh)
      server.httpServer?.once('close', () => {
        server.watcher
          .off('add', refresh)
          .off('change', refresh)
          .off('unlink', refresh)
      })
    },
  }
}
