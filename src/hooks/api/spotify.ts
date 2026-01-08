import { getCurrentlyPlaying } from '@/server/spotify'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getCurrentlyPlayingQueryOptions = queryOptions({
  queryKey: ['currently-playing'],
  queryFn: getCurrentlyPlaying,
  staleTime: 30 * 1000,
})

export const useGetCurrentlyPlayingQuery = () =>
  useQuery(getCurrentlyPlayingQueryOptions)
