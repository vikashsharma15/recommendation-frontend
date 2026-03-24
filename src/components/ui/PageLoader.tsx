/**
 * PageLoader — navigation transitions ke liye
 * Live chatbot.json Lottie animation use karta hai
 * App.tsx ke Suspense fallback mein use hota hai
 */
import { useEffect, useState } from 'react'

// Lottie player dynamically import — bundle size bachao
let LottiePlayer: any = null

export default function PageLoader({ message = 'Loading...' }: { message?: string }) {
  const [lottieReady, setLottieReady] = useState(false)
  const [animData, setAnimData] = useState<any>(null)

  useEffect(() => {
    // Dynamic import — sirf jab loader dikhna ho
    Promise.all([
      import('@lottiefiles/react-lottie-player').then(m => { LottiePlayer = m.Player }),
      fetch('/Live chatbot.json').then(r => r.json()),
    ]).then(([, data]) => {
      setAnimData(data)
      setLottieReady(true)
    }).catch(() => {
      // Fallback — Lottie fail hone par bhi kaam kare
      setLottieReady(false)
    })
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#06060e' }}
    >
      {lottieReady && LottiePlayer && animData ? (
        <LottiePlayer
          autoplay
          loop
          src={animData}
          style={{ width: 120, height: 120 }}
        />
      ) : (
        // Fallback spinner — web SVG
        <svg className="w-12 h-12 animate-spin" viewBox="0 0 48 48" fill="none"
          style={{ animationDuration: '2s' }}>
          {[0,1,2,3,4,5,6,7].map(i => {
            const a = (i/8)*Math.PI*2
            return <line key={i} x1="24" y1="24"
              x2={24+Math.cos(a)*20} y2={24+Math.sin(a)*20}
              stroke="#d4a843" strokeWidth="1" strokeOpacity="0.6" />
          })}
          {[7,13,19].map(r =>
            <circle key={r} cx="24" cy="24" r={r} fill="none" stroke="#d4a843" strokeWidth="0.7" strokeOpacity="0.4" />
          )}
          <circle cx="24" cy="24" r="2.5" fill="#d4a843" />
        </svg>
      )}

      <p className="mt-4 text-xs font-semibold tracking-widest uppercase"
        style={{ color: '#50508a' }}>
        {message}
      </p>
    </div>
  )
}

// ── Inline mini loader — buttons ke liye ────────────────
export function MiniLoader() {
  return (
    <svg className="w-4 h-4 animate-spin inline-block" viewBox="0 0 16 16" fill="none"
      style={{ animationDuration: '1.5s' }}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*Math.PI*2
        return <line key={i} x1="8" y1="8"
          x2={8+Math.cos(a)*6} y2={8+Math.sin(a)*6}
          stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.7" />
      })}
      <circle cx="8" cy="8" r="1.5" fill="#d4a843" />
    </svg>
  )
}