import { createFileRoute } from '@tanstack/react-router'

import { getCurrentlyPlayingQueryOptions } from '@/hooks/api/spotify'
import { getGithubContributionsQueryOptions } from '@/hooks/api/github-contributions'
import { GitHubContributions } from '@/components/github-contributions'
import { Container } from '@/components/motion-container'
import { Experience } from '@/components/experience'
import { Section } from '@/components/motion-section'
import { Profile } from '@/components/profile'
import { Spotify } from '@/components/spotify'

export const Route = createFileRoute('/(home)/_layout/')({
  component: HomePage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      getGithubContributionsQueryOptions,
    )
    await context.queryClient.ensureQueryData(getCurrentlyPlayingQueryOptions)
  },
})

function HomePage() {
  return (
    <Container>
      <Section>
        <Profile />
      </Section>

      <Section>
        <GitHubContributions />
      </Section>

      <Section>
        <Experience simplified />
      </Section>

      <Section>
        <Spotify />
      </Section>
    </Container>
  )
}
