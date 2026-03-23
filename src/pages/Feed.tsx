import { useRef, useEffect, useCallback, useState } from 'react'
import { Sparkles, RefreshCw, Newspaper, TrendingUp, BookOpen } from 'lucide-react'
import { useRecommendations } from '@/hooks/useRecommendations'
import { useAuth } from '@/hooks/useAuth'
import ArticleCard from '@/components/articles/ArticleCard'
import { FeedLoader } from '@/components/ui/Skeleton'
import { WebSpinner } from '@/components/ui/WebLoader'
import type { InteractionAction } from '@/types'

export default function Feed() {
  const { user } = useAuth()
  const {
    articles, groqSummary, totalCount,
    isLoading, isFetchingMore, hasMore,
    fetchMore, interact, refetch, isError,
  } = useRecommendations()

  const loaderRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Infinite scroll
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
          fetchMore()
        }
      },
      { threshold: 0.1, rootMargin: '300px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isFetchingMore, fetchMore])

  // Refresh — single call only
  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isLoading) return
    setIsRefreshing(true)
    try {
      await refetch()
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, isLoading, refetch])

  const handleInteract = useCallback(
    (id: string, action: InteractionAction) => interact.mutate({ id, action }),
    [interact]
  )

  const spinning = isRefreshing || isLoading

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-black flex items-center gap-2" style={{ color: '#f0f0fa' }}>
            <Newspaper className="w-5 h-5" style={{ color: '#d4a843' }} />
            Your Feed
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#50508a' }}>
            {user?.interests?.join(' · ') || '—'}
          </p>
        </div>

        {/* Refresh — single click, proper disabled state */}
        <button
          onClick={handleRefresh}
          disabled={spinning}
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
          style={{
            background: spinning ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.08)',
            border: '1px solid rgba(212,168,67,0.25)',
            color: '#d4a843',
            transform: spinning ? 'none' : undefined,
          }}
          onMouseEnter={e => { if (!spinning) (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
        >
          {spinning
            ? <><WebSpinner size={16} /> Refreshing...</>
            : <><RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> Refresh</>
          }
        </button>
      </div>

      {/* Stats bar */}
      {!isLoading && articles.length > 0 && (
        <div className="flex items-center gap-4 mb-5 p-3 rounded-xl flex-wrap"
          style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)' }}>
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#9090c0' }}>
            <TrendingUp className="w-4 h-4" style={{ color: '#d4a843' }} />
            <span className="font-black" style={{ color: '#d4a843' }}>{totalCount}</span> matched
          </div>
          <div className="w-px h-4 shrink-0" style={{ background: 'rgba(212,168,67,0.2)' }} />
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#9090c0' }}>
            <BookOpen className="w-4 h-4" />
            <span className="font-black">{articles.length}</span> loaded
          </div>
          <div className="w-px h-4 shrink-0" style={{ background: 'rgba(212,168,67,0.2)' }} />
          <div className="flex items-center gap-1.5 text-sm" style={{ color: '#9090c0' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
            AI curated
          </div>
        </div>
      )}

      {/* Groq summary */}
      {groqSummary && (
        <div className="mb-5 p-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" style={{ color: '#d4a843' }} />
            <span className="text-xs font-black tracking-wider uppercase" style={{ color: '#d4a843' }}>AI Insight</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#c0c0d8' }}>{groqSummary}</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-12 rounded-2xl mb-4"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="font-medium mb-3" style={{ color: '#ef4444' }}>Failed to load recommendations</p>
          <button onClick={handleRefresh}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {isLoading && <FeedLoader />}

      {/* Empty */}
      {!isLoading && !isError && articles.length === 0 && (
        <div className="text-center py-20 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,67,0.1)' }}>
          <img src="/spiderchat.png" alt=""
            style={{ width:60, height:60, opacity:0.3, filter:'sepia(1) saturate(2)', objectFit:'contain', margin:'0 auto 16px' }} />
          <h3 className="text-lg font-black mb-2" style={{ color: '#f0f0fa' }}>No articles yet</h3>
          <p className="text-sm max-w-xs mx-auto" style={{ color: '#50508a' }}>
            Update your interests in Settings to get personalized recommendations
          </p>
        </div>
      )}

      {/* Articles */}
      {!isLoading && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <ArticleCard
              key={article.article_id}
              article={article}
              onInteract={handleInteract}
              index={i}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="py-6 flex justify-center">
        {isFetchingMore && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#50508a' }}>
            <WebSpinner size={16} />
            Loading more...
          </div>
        )}
        {!hasMore && articles.length > 0 && !isFetchingMore && (
          <div className="flex items-center gap-3">
            <div className="h-px w-16" style={{ background: 'rgba(212,168,67,0.15)' }} />
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: '#30304a' }}>
              All caught up
            </p>
            <div className="h-px w-16" style={{ background: 'rgba(212,168,67,0.15)' }} />
          </div>
        )}
      </div>
    </div>
  )
}