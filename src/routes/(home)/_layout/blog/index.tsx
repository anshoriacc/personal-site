import { createFileRoute, Link } from '@tanstack/react-router'
import { posts } from 'virtual:blog'

import { createPageMeta } from '@/lib/seo'
import { formatPostDate } from '@/lib/blog-types'

export const Route = createFileRoute('/(home)/_layout/blog/')({
  head: () =>
    createPageMeta({
      title: 'Blog',
      description: 'Notes on software, interfaces, and things I’m learning.',
      path: '/blog',
    }),
  component: BlogPage,
})

function BlogPage() {
  return (
    <main className="flex flex-col gap-12 pb-12">
      <header className="space-y-2">
        <h1 className="font-semibold sm:text-lg">Blog</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Notes on software, interfaces, and things I’m learning.
        </p>
      </header>
      {posts.length ? (
        <ul className="divide-border divide-y">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group hover:bg-muted/50 focus-visible:outline-ring -mx-2 flex flex-col gap-2 rounded-lg px-2 py-6 transition-colors first:pt-2 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:transition-none"
              >
                <time
                  dateTime={post.date}
                  className="text-muted-foreground text-xs tabular-nums"
                >
                  {formatPostDate(post.date)}
                </time>
                <h2 className="font-medium text-pretty group-hover:underline group-hover:underline-offset-4">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed text-pretty">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground text-sm">
          No posts yet. Check back soon.
        </p>
      )}
    </main>
  )
}
