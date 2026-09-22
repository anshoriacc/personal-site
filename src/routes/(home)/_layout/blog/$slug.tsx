import { lazy, Suspense } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { posts, postLoaders } from 'virtual:blog'

import { createPageMeta } from '@/lib/seo'
import { formatPostDate } from '@/lib/blog-types'
import { mdxComponents } from '@/components/blog/mdx-components'

const postComponents = Object.fromEntries(
  Object.entries(postLoaders).map(([slug, load]) => [slug, lazy(load)]),
)

export const Route = createFileRoute('/(home)/_layout/blog/$slug')({
  loader: async ({ params }) => {
    const post = posts.find(({ slug }) => slug === params.slug)
    if (!post) throw notFound()
    await postLoaders[post.slug]()
    return post
  },
  head: ({ loaderData: post }) =>
    post
      ? createPageMeta({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          type: 'article',
          publishedTime: post.date,
        })
      : createPageMeta({ title: 'Post not found', noindex: true }),
  notFoundComponent: () => (
    <main className="space-y-6">
      <h1 className="font-semibold sm:text-lg">Post not found</h1>
      <p className="text-muted-foreground">
        This post doesn’t exist or hasn’t been published.
      </p>
      <BackToBlog />
    </main>
  ),
  component: BlogPostPage,
})

function BackToBlog() {
  return (
    <Link
      to="/blog"
      className="text-muted-foreground hover:text-foreground focus-visible:outline-ring inline-flex min-h-9 items-center gap-2 rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <IconArrowLeft aria-hidden="true" className="size-4" />
      All posts
    </Link>
  )
}

function BlogPostPage() {
  const post = Route.useLoaderData()
  const Content = postComponents[post.slug]

  return (
    <main className="min-w-0 pb-12">
      <BackToBlog />
      <article className="mt-8">
        <header className="border-border space-y-4 border-b pb-8">
          <time
            dateTime={post.date}
            className="text-muted-foreground text-xs tabular-nums"
          >
            {formatPostDate(post.date)}
          </time>
          <h1 className="text-2xl leading-snug font-semibold tracking-tight text-balance sm:text-3xl">
            {post.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {post.description}
          </p>
        </header>
        <div className="blog-content mt-8 min-w-0 text-[0.9375rem] leading-7 wrap-break-word">
          <Suspense fallback={<p role="status">Loading post…</p>}>
            <Content components={mdxComponents} />
          </Suspense>
        </div>
      </article>
      <footer className="border-border mt-12 border-t pt-6">
        <BackToBlog />
      </footer>
    </main>
  )
}
