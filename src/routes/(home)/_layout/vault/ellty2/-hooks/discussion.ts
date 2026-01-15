import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getDiscussions, createDiscussion } from '../-server/discussion'

const QUERY_KEY = ['tree-arithmetic-discussions']

export const discussionsQueryOptions = queryOptions({
  queryKey: QUERY_KEY,
  queryFn: getDiscussions,
  staleTime: 1000 * 10,
})

export const useDiscussionsQuery = () => useQuery(discussionsQueryOptions)

export const useCreateDiscussionMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { startingNumber: number }) => createDiscussion({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
