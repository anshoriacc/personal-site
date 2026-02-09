import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogViews, incrementBlogViews } from '@/server/blog-views'

export function useBlogViews(slug: string) {
  return useQuery({
    queryKey: ['blog-views', slug],
    queryFn: () => getBlogViews({ data: slug }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useIncrementBlogViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => incrementBlogViews({ data: slug }),
    onSuccess: (data, slug) => {
      queryClient.setQueryData(['blog-views', slug], data)
    },
  })
}
