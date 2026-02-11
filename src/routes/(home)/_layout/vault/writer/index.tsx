import { createFileRoute } from '@tanstack/react-router'
import { WriterForm } from './-components/writer-form'
import { Container } from '@/components/motion-container'
import { Section } from '@/components/motion-section'

export const Route = createFileRoute('/(home)/_layout/vault/writer/')({
  component: WriterPage,
})

function WriterPage() {
  return (
    <Container>
      <Section>
        <WriterForm />
      </Section>
    </Container>
  )
}
