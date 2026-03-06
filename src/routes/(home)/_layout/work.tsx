import { createFileRoute } from '@tanstack/react-router'

import { createPageMeta } from '@/lib/seo'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { Experience } from '@/components/experience'

export const Route = createFileRoute('/(home)/_layout/work')({
  component: WorksPage,
  head: () =>
    createPageMeta({
      title: 'Work',
      description:
        'Some of my work experiencem including companies I have worked for and projects I have contributed to.',
      path: '/work',
    }),
})

function WorksPage() {
  return (
    <MotionContainer as="main" className="space-y-12">
      <MotionItem>
        <Experience />
      </MotionItem>
    </MotionContainer>
  )
}
