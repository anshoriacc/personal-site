import { createFileRoute } from '@tanstack/react-router'
import { Profile } from '@/components/profile'
import { GitHubContributions } from '@/components/github-contributions'
import { getGithubContributionsQueryOptions } from '@/hooks/api/github-contributions'

export const Route = createFileRoute('/(home)/_layout/')({
  component: RouteComponent,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(getGithubContributionsQueryOptions),
})

function RouteComponent() {
  return (
    <main className="flex flex-col space-y-12">
      <Profile />
      <GitHubContributions />
    </main>
  )
}
