import { createServerFn } from '@tanstack/react-start'
import { axiosApi } from '@/lib/axios'
import { LRUCache } from '@/lib/lru-cache'

// Cache GitHub contributions for 1 hour
const githubCache = new LRUCache<TContributionResponse>({
  maxSize: 5,
  defaultTTL: 60 * 60 * 1000, // 1 hour
})

export const getGithubContributions = createServerFn().handler(
  async (): Promise<TContributionResponse> => {
    const cacheKey = 'github-contributions'
    const cached = githubCache.get(cacheKey)

    if (cached) {
      return cached
    }

    const response = await axiosApi<TContributionResponse>(
      'https://github-contributions-api.jogruber.de/v4/anshoriacc',
      {
        params: { y: 'last' }, // last year of contributions
      },
    )

    const data = response.data

    githubCache.set(cacheKey, data)

    return data
  },
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
