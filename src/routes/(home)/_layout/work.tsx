import { createFileRoute } from '@tanstack/react-router'

import { Container } from '@/components/motion-container'
import { Section } from '@/components/motion-section'
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
    <Container>
      <Section>
        <Experience />
      </Section>
    </Container>
  )
}
