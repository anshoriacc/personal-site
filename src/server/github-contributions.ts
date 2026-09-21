import { createServerFn } from '@tanstack/react-start'
import { AsyncTTLCache } from '@/lib/async-ttl-cache'

const githubCache = new AsyncTTLCache<TContributionResponse>({
  freshTTL: 60 * 60 * 1000,
  staleTTL: 24 * 60 * 60 * 1000,
})

export const getGithubContributions = createServerFn().handler(
  (): Promise<TContributionResponse> =>
    githubCache.get(async () => {
      const response = await fetch(
        'https://github-contributions-api.jogruber.de/v4/anshoriacc?y=last',
      )

      if (!response.ok) {
        throw new Error(
          `GitHub contributions request failed with status ${response.status}`,
        )
      }

      return (await response.json()) as TContributionResponse
    }),
)

type TContributionResponse = {
  total: {
    [year: string | number]: number
  }
  contributions: Array<{
    date: string
    count: number
    level: 0 | 1 | 2 | 3 | 4
  }>
}
