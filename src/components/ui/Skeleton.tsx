import { cn } from '@/lib/utils'

interface SkeletonProps { className?: string }

export default function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('shimmer rounded-xl', className)} />
}

export function ArticleSkeleton() {
  return (
    <div className="rounded-2xl border border-surface-200 p-6 space-y-4 animate-pulse bg-white">
      <div className="flex items-center gap-3">
        <Skeleton className="w-16 h-5" />
        <Skeleton className="w-24 h-5" />
      </div>
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-4/5 h-4" />
      <Skeleton className="w-3/4 h-4" />
    </div>
  )
}

export function FeedLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      {/* Spider web spinner */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full animate-spin" viewBox="0 0 64 64" fill="none" style={{ animationDuration: '3s' }}>
          {[0,1,2,3,4,5,6,7].map(i => {
            const a = (i / 8) * Math.PI * 2
            return <line key={i} x1="32" y1="32" x2={32 + Math.cos(a) * 28} y2={32 + Math.sin(a) * 28} stroke="#d4a843" strokeWidth="1" strokeOpacity="0.6" />
          })}
          {[8, 16, 24].map(r => (
            <circle key={r} cx="32" cy="32" r={r} fill="none" stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.4" />
          ))}
          <circle cx="32" cy="32" r="3" fill="#d4a843" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold mb-1" style={{ color: '#d4a843' }}>
          Spinning your web...
        </p>
        <p className="text-xs" style={{ color: '#50508a' }}>
          Fetching personalized recommendations
        </p>
      </div>
      {/* Skeleton preview */}
      <div className="w-full max-w-lg space-y-3 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)' }}>
            <div className="flex gap-3 mb-3">
              <div className="h-4 w-16 rounded" style={{ background: 'rgba(212,168,67,0.1)', animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }} />
              <div className="h-4 w-24 rounded" style={{ background: 'rgba(212,168,67,0.08)', animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite` }} />
            </div>
            <div className="h-5 w-full rounded mb-2" style={{ background: 'rgba(255,255,255,0.04)', animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
            <div className="h-4 w-3/4 rounded" style={{ background: 'rgba(255,255,255,0.03)', animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
    </div>
  )
}