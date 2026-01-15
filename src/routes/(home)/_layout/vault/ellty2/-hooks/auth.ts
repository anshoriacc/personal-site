import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSession, login, logout, register } from '../-server/auth'

const QUERY_KEY = ['tree-arithmetic-session']

export const sessionQueryOptions = queryOptions({
  queryKey: QUERY_KEY,
  queryFn: getSession,
  staleTime: 1000 * 60 * 5,
})

export const useSessionQuery = () => useQuery(sessionQueryOptions)

export const useRegisterMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { username: string; password: string }) => register({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { username: string; password: string }) => login({ data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
