import { useState, memo, useCallback } from 'react'
import { ThumbsUp, SkipForward, BookOpen, ExternalLink, X, Clock, Tag } from 'lucide-react'
import type { Article, InteractionAction } from '@/types'

const categoryColors: Record<string, string> = {
  'World':              '#3b82f6',
  'Sports':             '#f59e0b',
  'Business':           '#10b981',
  'Science/Technology': '#8b5cf6',
}
const categoryEmoji: Record<string, string> = {
  'World': '🌍', 'Sports': '🏆', 'Business': '📈', 'Science/Technology': '🔬',
}
function scoreToLabel(s: number) {
  if (s >= 0.8) return 'Top pick'
  if (s >= 0.6) return 'Great match'
  if (s >= 0.4) return 'Good match'
  return 'Relevant'
}

// ── Article Reader Modal ───────────────────────────────────
function ArticleModal({ article, onClose }: { article: Article; onClose: () => void }) {
  const color = categoryColors[article.category] || '#6366f1'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: '#0d0d1a', border: '1px solid rgba(212,168,67,0.2)', boxShadow: '0 24px 80px rgba(0,0,0,0.8)', animation: 'modalIn 0.2s ease' }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                {categoryEmoji[article.category]} {article.category}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(212,168,67,0.1)', color: '#d4a843', border: '1px solid rgba(212,168,67,0.2)' }}>
                {Math.round(article.score * 100)}% match
              </span>
            </div>
            <h2 className="text-base font-black leading-snug" style={{ color: '#f0f0fa' }}>
              {article.title}
            </h2>
          </div>
          <button onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#7070a0' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = '#7070a0' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: '#c0c0d8', lineHeight: 1.8 }}>
            {article.description}
          </p>
          {/* Placeholder for full content — article.content agar backend se aaye */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.1)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: '#d4a843' }}>📰 Full article</p>
            <p className="text-xs" style={{ color: '#50508a' }}>
              Read the complete story on the original source — click the button below.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 shrink-0 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: '#50508a' }}>
            <Tag className="w-3.5 h-3.5" />
            {scoreToLabel(article.score)}
          </div>
          {article.url && article.url !== '#' ? (
            <a href={article.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-black text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 4px 16px rgba(212,168,67,0.4)' }}>
              <ExternalLink className="w-3.5 h-3.5" />
              Read on source
            </a>
          ) : (
            <span className="text-xs px-4 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', color: '#50508a' }}>
              No source URL
            </span>
          )}
        </div>
      </div>
      <style>{`@keyframes modalIn { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }`}</style>
    </div>
  )
}

// ── Article Card ───────────────────────────────────────────
const ArticleCard = memo(function ArticleCard({
  article, onInteract, index,
}: {
  article: Article
  onInteract: (id: string, action: InteractionAction) => void
  index: number
}) {
  const [liked,   setLiked]   = useState(false)
  const [read,    setRead]    = useState(false)
  const [skipped, setSkipped] = useState(false)
  const [modal,   setModal]   = useState(false)

  const handleLike = useCallback(() => {
    if (liked) return
    setLiked(true)
    onInteract(article.article_id, 'liked')
  }, [liked, article.article_id, onInteract])

  const handleRead = useCallback(() => {
    setModal(true)
    if (!read) {
      setRead(true)
      onInteract(article.article_id, 'viewed')
    }
  }, [read, article.article_id, onInteract])

  const handleSkip = useCallback(() => {
    setSkipped(true)
    onInteract(article.article_id, 'skipped')
  }, [article.article_id, onInteract])

  if (skipped) return null

  const color = categoryColors[article.category] || '#6366f1'

  return (
    <>
      <article
        className="group rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-default"
        style={{
          background:      read ? 'rgba(255,255,255,0.015)' : '#0d0d1a',
          border:          read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)',
          opacity:         read ? 0.7 : 1,
          animation:       'fadeInUp 0.3s ease both',
          animationDelay:  `${Math.min(index * 40, 400)}ms`,
        }}
        onMouseEnter={e => {
          if (!read) (e.currentTarget as HTMLElement).style.border = `1px solid ${color}35`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.border =
            read ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <div className="p-5">
          {/* Top row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                {categoryEmoji[article.category]} {article.category}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(212,168,67,0.08)', color: '#d4a843', border: '1px solid rgba(212,168,67,0.15)' }}>
                {scoreToLabel(article.score)}
              </span>
            </div>
            <span className="text-xs font-mono font-bold shrink-0" style={{ color: '#40405a' }}>
              {Math.round(article.score * 100)}%
            </span>
          </div>

          {/* Title — clickable */}
          <h3 onClick={handleRead}
            className="font-bold text-[15px] leading-snug mb-2 line-clamp-2 cursor-pointer transition-colors hover:underline decoration-dotted"
            style={{ color: read ? '#50508a' : '#e0e0f0', textUnderlineOffset: '3px' }}>
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed line-clamp-2 mb-4" style={{ color: '#45456a' }}>
            {article.description}
          </p>

          {/* Actions — gold/dark only, no green/yellow */}
          <div className="flex items-center gap-2 flex-wrap">

            {/* Read */}
            <button onClick={handleRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
              style={{
                background: read ? 'rgba(212,168,67,0.08)' : 'rgba(255,255,255,0.05)',
                color:      read ? '#d4a843' : '#9090b0',
                border:     read ? '1px solid rgba(212,168,67,0.2)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              <BookOpen className="w-3.5 h-3.5" />
              {read ? 'Read again' : 'Read'}
            </button>

            {/* Like */}
            <button onClick={handleLike} disabled={liked}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 disabled:cursor-default"
              style={{
                background: liked ? 'rgba(212,168,67,0.12)' : 'rgba(255,255,255,0.05)',
                color:      liked ? '#36f036' : '#9090b0',
                border:     liked ? '1px solid rgba(212,168,67,0.25)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              <ThumbsUp className={`w-3.5 h-3.5 transition-transform ${liked ? 'scale-125' : ''}`} />
              {liked ? 'Liked' : 'Like'}
            </button>

            {/* Skip */}
            <button onClick={handleSkip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#9090b0', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(239,68,68,0.25)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9090b0'; (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.08)' }}>
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </button>

            {/* External link */}
            <div className="ml-auto">
              {article.url && article.url !== '#' ? (
                <a href={article.url} target="_blank" rel="noopener noreferrer"
                  onClick={() => { if (!read) { setRead(true); onInteract(article.article_id, 'viewed') } }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-black transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 2px 10px rgba(212,168,67,0.3)' }}>
                  <ExternalLink className="w-3 h-3" />
                  Source
                </a>
              ) : (
                <button onClick={handleRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black text-black transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 2px 10px rgba(212,168,67,0.3)' }}>
                  <BookOpen className="w-3 h-3" />
                  View
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Modal */}
      {modal && <ArticleModal article={article} onClose={() => setModal(false)} />}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
})

export default ArticleCard