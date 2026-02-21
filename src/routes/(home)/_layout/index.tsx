import { createFileRoute } from '@tanstack/react-router'

import { getCurrentlyPlayingQueryOptions } from '@/hooks/api/spotify'
import { getGithubContributionsQueryOptions } from '@/hooks/api/github-contributions'
import { GitHubContributions } from '@/components/github-contributions'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { Experience } from '@/components/experience'
import { Profile } from '@/components/profile'
import { Spotify } from '@/components/spotify'

export const Route = createFileRoute('/(home)/_layout/')({
  component: HomePage,
  loader: async ({ context }) => {
    try {
      await Promise.all([
        context.queryClient.ensureQueryData(getGithubContributionsQueryOptions),
        context.queryClient.ensureQueryData(getCurrentlyPlayingQueryOptions),
      ])
    } catch (error) {
      console.error('Error prefetching data in HomePage loader:', error)
    }
  },
  head: () => ({
    links: [
      {
        rel: 'canonical',
        href: `${process.env.SITE_URL || 'https://anshori.com'}/`,
      },
    ],
  }),
})

function HomePage() {
  return (
    <MotionContainer as="main" className="space-y-12">
      <MotionItem>
        <Profile />
      </MotionItem>

      <MotionItem>
        <Experience simplified />
      </MotionItem>

      <MotionItem>
        <GitHubContributions />
      </MotionItem>

      <MotionItem>
        <Spotify />
      </MotionItem>
    </MotionContainer>
  )
}
