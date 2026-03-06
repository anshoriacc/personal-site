import { createFileRoute } from '@tanstack/react-router'

import { createPageMeta } from '@/lib/seo'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { WriterForm } from './-components/writer-form'

export const Route = createFileRoute('/(home)/_layout/vault/writer/')({
  component: WriterPage,
  head: () =>
    createPageMeta({
      title: 'Markdown Writer',
      description:
        'A markdown generator tool with front matter support, MDX editor, and copy/download functionality.',
      path: '/vault/writer',
      ogSubtitle: 'Vault Project',
      noindex: true,
    }),
})

function WriterPage() {
  return (
    <MotionContainer as="main" className="space-y-12">
      <MotionItem>
        <WriterForm />
      </MotionItem>
    </MotionContainer>
  )
}
