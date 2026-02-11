import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { getThreads, createThread } from '../-server/thread'

const QUERY_KEY = ['tree-arithmetic-threads']

export const threadsQueryOptions = queryOptions({
  queryKey: QUERY_KEY,
  queryFn: getThreads,
  staleTime: 1000 * 10,
})

export const useThreadsQuery = () => useQuery(threadsQueryOptions)

export const useCreateThreadMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { startingNumber: number }) => createThread({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
