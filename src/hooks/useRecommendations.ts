import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { recommendService } from '@/services/recommend.service'
import type { InteractionAction } from '@/types'

const PAGE_SIZE = 10

export function prefetchRecommendations(qc: ReturnType<typeof useQueryClient>) {
  return qc.prefetchInfiniteQuery({
    queryKey: ['recommendations'],
    queryFn: ({ pageParam = 1 }) =>
      recommendService.getRecommendations(pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecommendations() {
  const qc = useQueryClient()

  const query = useInfiniteQuery({
    queryKey: ['recommendations'],
    queryFn: ({ pageParam = 1 }) =>
      recommendService.getRecommendations(pageParam as number, PAGE_SIZE),

    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta
      if (!meta) return undefined

      // ── Fix: total = poore dataset ka count ────────────
      // Backend total=50 bhejta hai (sab results)
      // page_size=10, page=1 → totalPages=5 → next=2
      const totalPages = Math.ceil(meta.total / meta.page_size)
      return meta.page < totalPages ? meta.page + 1 : undefined
    },

    initialPageParam: 1,
    staleTime:  5 * 60 * 1000,
    gcTime:    10 * 60 * 1000,

    retry: (failureCount, error: any) => {
      const status = error?.response?.status
      if (status && status >= 400 && status < 500) return false
      return failureCount < 2
    },
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),

    refetchOnWindowFocus: false,
    refetchOnReconnect:   false,
  })

  const interact = useMutation({
    mutationFn: ({ id, action }: { id: string; action: InteractionAction }) =>
      recommendService.logInteraction(id, action),

    onMutate: async ({ id, action }) => {
      await qc.cancelQueries({ queryKey: ['recommendations'] })
      const previous = qc.getQueryData(['recommendations'])
      qc.setQueryData(['recommendations'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              recommendations: page.data?.recommendations?.map((a: any) =>
                a.article_id === id ? { ...a, _interacted: action } : a
              ),
            },
          })),
        }
      })
      return { previous }
    },

    onSuccess: (_, { action }) => {
      if (action === 'liked')   toast.success('Liked! 🕷️')
      if (action === 'skipped') toast('Skipped', { icon: '⏭️' })
    },

    onError: (_, __, context) => {
      if (context?.previous) qc.setQueryData(['recommendations'], context.previous)
      toast.error('Could not log interaction')
    },
  })

  const articles    = query.data?.pages.flatMap(p => p.data?.recommendations ?? []) ?? []
  const groqSummary = query.data?.pages[0]?.data?.groq_summary ?? null

  // ── Fix: totalCount = page 1 ka meta.total (poora dataset) ──
  const totalCount  = query.data?.pages[0]?.meta?.total ?? 0

  return {
    articles,
    groqSummary,
    totalCount,
    isLoading:      query.isLoading,
    isFetchingMore: query.isFetchingNextPage,
    hasMore:        query.hasNextPage ?? false,
    fetchMore:      query.fetchNextPage,
    interact,
    refetch: () => {
      qc.removeQueries({ queryKey: ['recommendations'] })
      return query.refetch()
    },
    isError: query.isError,
  }
}