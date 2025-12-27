import { axiosApi } from '@/lib/axios'
import { createServerFn } from '@tanstack/react-start'

export const getGithubContributions = createServerFn().handler(async () => {
  const response = await axiosApi<TContributionResponse>(
    'https://github-contributions-api.jogruber.de/v4/anshoriacc',
  )

  const data = response.data
  return data
})

type TContributionResponse = {
  total: {
    [year: string]: number
  }
  contributions: Array<{
    date: string
    count: number
    level: number
  }>
}
