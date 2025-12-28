import { getGithubContributions } from '@/server/github-contributions'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getGithubContributionsQueryOptions = queryOptions({
  queryKey: ['github-contributions'],
  queryFn: getGithubContributions,
})

export const useGetGithubContributionsQuery = () =>
  useQuery(getGithubContributionsQueryOptions)
