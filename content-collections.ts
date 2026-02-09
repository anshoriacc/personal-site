import { defineCollection, defineConfig } from '@content-collections/core'
import matter from 'gray-matter'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
    content: z.string(),
  }),
  transform: (post) => {
    const { content } = matter(post.content)
    return {
      ...post,
      content,
    }
  },
})

export default defineConfig({ collections: [posts] })
