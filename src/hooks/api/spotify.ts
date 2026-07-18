import { getCurrentlyPlaying } from '@/server/spotify'
import { queryOptions, useQuery } from '@tanstack/react-query'

export const getCurrentlyPlayingQueryOptions = queryOptions({
  queryKey: ['currently-playing'],
  queryFn: getCurrentlyPlaying,
  staleTime: 15 * 1000, // 15 seconds
  refetchInterval: 15 * 1000, // 15 seconds
})

export const useGetCurrentlyPlayingQuery = () =>
  useQuery(getCurrentlyPlayingQueryOptions)
