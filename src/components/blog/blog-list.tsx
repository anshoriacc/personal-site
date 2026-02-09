import { memo } from 'react'
import { allPosts } from 'content-collections'
import { BlogCard } from './blog-card'

export const BlogList = memo(function BlogList() {
  // Filter and sort posts in single pass
  const publishedPosts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (publishedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No blog posts yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {publishedPosts.map((post) => (
        <BlogCard
          key={post.slug}
          title={post.title}
          excerpt={post.excerpt}
          date={new Date(post.date)}
          slug={post.slug}
          tags={post.tags}
        />
      ))}
    </div>
  )
})
