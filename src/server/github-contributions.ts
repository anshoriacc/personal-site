import { createServerFn } from '@tanstack/react-start'
import { axiosApi } from '@/lib/axios'

const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export const getGithubContributions = createServerFn().handler(
  async (): Promise<TContributionResponse> => {
    const cacheKey = 'github-contributions'
    const now = Date.now()

    const cached = cache.get(cacheKey)

    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.data
    }

    const response = await axiosApi<TContributionResponse>(
      'https://github-contributions-api.jogruber.de/v4/anshoriacc',
      {
        params: { y: 'last' }, // last year of contributions
      },
    )

    const data = response.data

    cache.set(cacheKey, {
      data: data,
      timestamp: now,
    })

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
