import { createFileRoute } from '@tanstack/react-router'

import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { Experience } from '@/components/experience'

export const Route = createFileRoute('/(home)/_layout/work')({
  component: WorksPage,
  head: () => ({
    links: [
      {
        rel: 'canonical',
        href: `${process.env.SITE_URL || 'https://anshori.com'}/work`,
      },
    ],
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
