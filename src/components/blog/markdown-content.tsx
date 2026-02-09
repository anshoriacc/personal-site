import React, { memo } from 'react'
import parse from 'html-react-parser'
import { renderMarkdown } from '@/lib/markdown'

type Props = {
  content: string
}

export const MarkdownContent = memo(function MarkdownContent({
  content,
}: Props) {
  const [html, setHtml] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    let isMounted = true

    const processContent = async () => {
      try {
        const renderedHtml = await renderMarkdown(content)
        if (isMounted) {
          setHtml(renderedHtml)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error rendering markdown:', error)
        if (isMounted) {
          setHtml(`<p class="text-red-500">Error rendering content</p>`)
          setIsLoading(false)
        }
      }
    }

    processContent()

    return () => {
      isMounted = false
    }
  }, [content])

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="bg-muted h-4 w-3/4 rounded" />
        <div className="bg-muted h-4 rounded" />
        <div className="bg-muted h-4 w-5/6 rounded" />
      </div>
    )
  }

  return (
    <div className="prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary/80 prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-muted prose-pre:rounded-lg [&_th]:bg-muted max-w-none [&_img]:mx-auto [&_img]:my-8 [&_img]:block [&_img]:w-full [&_img]:max-w-240 [&_img]:rounded-lg [&_table]:mx-auto [&_table]:my-8 [&_table]:block [&_table]:w-full [&_table]:max-w-240 [&_table]:border-collapse [&_td]:border-t [&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold">
      {parse(html)}
    </div>
  )
})
