import { Container } from '@/components/motion-container'
import { Section } from '@/components/motion-section'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { AuthPanel } from './-components/auth-panel'
import { NewDiscussionForm } from './-components/new-discussion-form'
import { DiscussionList } from './-components/discussion-list'
import { useSessionQuery } from './-hooks/auth'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronRight, Info } from '@hugeicons/core-free-icons'

export const Route = createFileRoute('/(home)/_layout/vault/ellty2/')({
  component: Ellty2Page,
})

function Ellty2Page() {
  const { data: session } = useSessionQuery()

  return (
    <Container className="space-y-">
      <Section>
        <h1 className="font-medium sm:text-lg">Tree Arithmetic</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          A number discussion app where you communicate through math operations
        </p>
      </Section>

      <Section>
        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button
                size="lg"
                variant="ghost"
                className="group w-full justify-start"
              >
                <span>Description</span>
                <span className="ml-auto transition-transform group-aria-expanded:rotate-90">
                  <HugeiconsIcon icon={ChevronRight} className="size-4" />
                </span>
              </Button>
            }
          />

          <CollapsibleContent className="space-y-3 px-3 pt-4">
            <p className="font-medium">Stack</p>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-foreground">Frontend</p>
                <p className="text-muted-foreground">
                  TanStack Start, React Router, TypeScript
                </p>
              </div>
              <div>
                <p className="text-foreground">Database</p>
                <p className="text-muted-foreground">
                  Drizzle ORM with PostgreSQL
                </p>
              </div>
              <div>
                <p className="text-foreground">Authentication</p>
                <p className="text-muted-foreground">
                  Cookie-based session (7day expiry time, httpOnly)
                </p>
              </div>
              <div>
                <p className="text-foreground">Forms & Validation</p>
                <p className="text-muted-foreground">
                  TanStack Form with Zod schemas (client & server)
                </p>
              </div>
              <div>
                <p className="text-foreground">State Management</p>
                <p className="text-muted-foreground">
                  TanStack Query for data fetching and caching
                </p>
              </div>
              <div>
                <p className="text-foreground">Deployment</p>
                <p className="text-muted-foreground">
                  Self-hosted Coolify with Docker
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Section>

      <Section className="space-y-4">
        {!session && (
          <Alert variant="default">
            <HugeiconsIcon icon={Info} className="size-4" />

            <AlertDescription>
              Login to start or reply to discussions.
            </AlertDescription>
          </Alert>
        )}
        <AuthPanel />
      </Section>

      <Section>{session && <NewDiscussionForm />}</Section>

      <Section className="space-y-4">
        <h2 className="font-medium">Discussions</h2>

        <DiscussionList />
      </Section>
    </Container>
  )
}
