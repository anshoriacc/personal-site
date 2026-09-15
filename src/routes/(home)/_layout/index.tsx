import { createFileRoute } from '@tanstack/react-router'

import { createPageMeta } from '@/lib/seo'
import { getCurrentlyPlayingQueryOptions } from '@/hooks/api/spotify'
import { getGithubContributionsQueryOptions } from '@/hooks/api/github-contributions'
import { CurrentlyPlaying } from '@/components/currently-playing'
import { SimplifiedExperience } from '@/components/experience'
import { Profile } from '@/components/profile'

export const Route = createFileRoute('/(home)/_layout/')({
  component: HomePage,
  loader: async ({ context }) => {
    try {
      await Promise.all([
        context.queryClient.query({
          ...getGithubContributionsQueryOptions,
          staleTime: Infinity,
        }),
        context.queryClient.query({
          ...getCurrentlyPlayingQueryOptions,
          staleTime: Infinity,
        }),
      ])
    } catch (error) {
      console.error('Error prefetching data in HomePage loader:', error)
    }
  },
  head: () => createPageMeta({ path: '/' }),
})

function HomePage() {
  return (
    <main className="space-y-12">
      <Profile />

      <SimplifiedExperience />

      <CurrentlyPlaying />
    </main>
  )
}
