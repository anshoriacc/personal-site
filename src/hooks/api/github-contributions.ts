import { getGithubContributions } from '@/server/github-contributions'
import { queryOptions } from '@tanstack/react-query'

export const getGithubContributionsQueryOptions = queryOptions({
  queryKey: ['github-contributions'],
  queryFn: () => getGithubContributions(),
})
