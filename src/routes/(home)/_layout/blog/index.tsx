import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { BlogList } from '@/components/blog/blog-list'

export const Route = createFileRoute('/(home)/_layout/blog/')({
  component: BlogIndex,
  head: () => ({
    meta: [
      {
        title: 'Blog',
      },
      {
        name: 'description',
        content: 'Thoughts, tutorials, and insights about web development.',
      },
    ],
  }),
})

function BlogIndex() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      <BlogList />

      {import.meta.env.DEV && (
        <div className="border-t pt-8">
          <Link
            to="/blog/new"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm"
          >
            + Create new post (dev only)
          </Link>
        </div>
      )}
    </motion.div>
  )
}
