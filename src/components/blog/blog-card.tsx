import { memo, useMemo } from 'react'
import { Link } from '@tanstack/react-router'

import { Badge } from '@/components/ui/badge'
import { calculateReadingTime } from '@/lib/markdown'
import { useBlogViews } from '@/hooks/use-blog-views'

interface BlogCardProps {
  title: string
  excerpt: string
  date: Date
  slug: string
  tags?: Array<string>
}

export const BlogCard = memo(function BlogCard({
  title,
  excerpt,
  date,
  slug,
  tags,
}: BlogCardProps) {
  const readingTime = useMemo(() => calculateReadingTime(excerpt), [excerpt])
  const { data: viewCount } = useBlogViews(slug)

  return (
    <article className="group relative flex flex-col space-y-2">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <time dateTime={date.toISOString()}>
          {date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>{readingTime} min read</span>
        {viewCount !== undefined && (
          <>
            <span>·</span>
            <span>{viewCount.toLocaleString()} views</span>
          </>
        )}
      </div>

      <Link to={`/blog/$slug`} params={{ slug }} className="group/title block">
        <h3 className="text-foreground group-hover/title:text-primary font-semibold transition-colors">
          {title}
        </h3>
      </Link>

      <p className="text-muted-foreground line-clamp-2">{excerpt}</p>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </article>
  )
})
