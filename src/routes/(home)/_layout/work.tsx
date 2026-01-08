import { createFileRoute } from '@tanstack/react-router'

import { Container } from '@/components/motion-container'
import { Section } from '@/components/motion-section'
import { Experience } from '@/components/experience'

export const Route = createFileRoute('/(home)/_layout/work')({
  component: WorksPage,
  head: () => ({
    meta: [
      { title: 'Work - Achmad Anshori' },
      { name: 'description', content: 'Achmad Anshori Work Experience' },
      { property: 'og:title', content: 'Work - Achmad Anshori' },
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
