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
      <header className="flex flex-col gap-2">
        <h1 className="font-semibold sm:text-lg">Blog</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Notes on software, interfaces, and things I’m learning.
        </p>
      </header>
      {posts.length ? (
        <ul className="flex flex-col gap-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group focus-visible:outline-ring flex flex-col gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h2 className="font-medium text-pretty group-hover:underline group-hover:underline-offset-4">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="text-muted-foreground shrink-0 text-xs tabular-nums"
                  >
                    {formatPostDate(post.date)}
                  </time>
                </div>
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
