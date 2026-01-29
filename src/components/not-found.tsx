import { Link } from '@tanstack/react-router'
import { Header } from './header'
import { Container } from './motion-container'
import { Section } from './motion-section'
import { Button } from './ui/button'

export const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col p-4 pt-22">
      <Header />

      <div className="flex flex-1 items-center justify-center">
        <Container>
          <Section className="flex flex-col items-center gap-4 text-center">
            <h1 className="font-semibold sm:text-lg">404 Not Found</h1>

            <p className="text-muted-foreground">
              The page you are looking for does not exist.
            </p>

            <Button
              variant="secondary"
              render={<Link to="/" className="w-fit" />}
              nativeButton={false}
            >
              Return Home
            </Button>
          </Section>
        </Container>
      </div>
    </div>
  )
}
