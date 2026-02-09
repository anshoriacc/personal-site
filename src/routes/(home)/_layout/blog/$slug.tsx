import { createFileRoute, notFound } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import { Calendar, Clock, Eye } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { calculateReadingTime } from '@/lib/markdown'
import { MarkdownContent } from '@/components/blog/markdown-content'
import { useBlogViews, useIncrementBlogViews } from '@/hooks/use-blog-views'

export const Route = createFileRoute('/(home)/_layout/blog/$slug')({
  component: BlogPost,
  loader: ({ params: { slug } }) => {
    const post = allPosts.find((p) => p.slug === slug && p.published)
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.post.title,
      },
      {
        name: 'description',
        content: loaderData?.post.excerpt,
      },
    ],
  }),
})

function BlogPost() {
  const { post } = Route.useLoaderData()
  const readingTime = calculateReadingTime(post.content)
  const { data: views } = useBlogViews(post.slug)
  const incrementViews = useIncrementBlogViews()

  useEffect(() => {
    // Increment view count when post loads
    incrementViews.mutate(post.slug)
  }, [post.slug])

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-foreground font-bold tracking-tight sm:text-lg">
            {post.title}
          </h1>

          <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar} size={16} />
              <time dateTime={post.date.toISOString()}>
                {post.date.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Clock} size={16} />
              <span>{readingTime} min read</span>
            </div>
            {views !== undefined && (
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Eye} size={16} />
                <span>{views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-8">
        <MarkdownContent content={post.content} />
      </div>
    </motion.article>
  )
}
