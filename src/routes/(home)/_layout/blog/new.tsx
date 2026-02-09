import { createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense, lazy } from 'react'

// Only load MDXEditor in development mode
const MDXEditorComponent = lazy(() =>
  import.meta.env.DEV
    ? import('@/components/blog/mdx-editor-page')
    : Promise.reject(new Error('Editor only available in development mode')),
)

export const Route = createFileRoute('/(home)/_layout/blog/new')({
  component: NewBlogPost,
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound()
    }
  },
  head: () => ({
    meta: [
      {
        title: 'New Blog Post',
      },
      {
        name: 'description',
        content:
          'Create a new blog post with the MDXEditor (development only).',
      },
    ],
  }),
})

function NewBlogPost() {
  return (
    <Suspense fallback={<div className="p-8">Loading editor...</div>}>
      <MDXEditorComponent />
    </Suspense>
  )
}
