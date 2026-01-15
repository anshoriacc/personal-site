import { Container } from '@/components/motion-container'
import { Section } from '@/components/motion-section'
import { createFileRoute } from '@tanstack/react-router'
import { AuthPanel } from './-components/auth-panel'
import { NewDiscussionForm } from './-components/new-discussion-form'
import { DiscussionList } from './-components/discussion-list'
import { useSessionQuery } from './-hooks/auth'

export const Route = createFileRoute('/(home)/_layout/vault/ellty2/')({
  component: Ellty2Page,
})

function Ellty2Page() {
  const { data: session } = useSessionQuery()

  return (
    <Container>
      <Section className="flex flex-col space-y-6">
        <div>
          <h1 className="font-medium sm:text-lg">Tree Arithmetic</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A number discussion app where you communicate through math operations
          </p>
        </div>

        <AuthPanel />

        {session && <NewDiscussionForm />}

        <DiscussionList />
      </Section>
    </Container>
  )
}
