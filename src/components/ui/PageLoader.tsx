import { useEffect, useState } from 'react'

function WebSpinner() {
  return (
    <svg className="w-14 h-14 animate-spin" viewBox="0 0 56 56" fill="none"
      style={{ animationDuration: '2s' }}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i / 8) * Math.PI * 2
        return <line key={i} x1="28" y1="28"
          x2={28 + Math.cos(a) * 24} y2={28 + Math.sin(a) * 24}
          stroke="#d4a843" strokeWidth="1" strokeOpacity="0.6" />
      })}
      {[8, 15, 22].map(r =>
        <circle key={r} cx="28" cy="28" r={r} fill="none"
          stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.35" />
      )}
      <circle cx="28" cy="28" r="3" fill="#d4a843" />
    </svg>
  )
}

function LottieLoader() {
  const [comp, setComp] = useState<React.ReactNode>(null)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const { Player } = await import('@lottiefiles/react-lottie-player')

        // Try live-chatbot.json first, then with space
        const res = await fetch('/live-chatbot.json').catch(() => null)
          ?? await fetch('/Live chatbot.json').catch(() => null)

        if (!active || !res?.ok) return

        const data = await res.json()
        if (!active) return

        setComp(
          <Player autoplay loop src={data} style={{ width: 120, height: 120 }} />
        )
      } catch {
        // fallback stays as null — WebSpinner shown
      }
    }

    load()
    return () => { active = false }
  }, [])

  return <>{comp ?? <WebSpinner />}</>
}

export default function PageLoader({ message = '' }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{ background: '#06060e' }}>
      <LottieLoader />
      {message && (
        <p className="mt-4 text-xs font-semibold tracking-widest uppercase"
          style={{ color: '#50508a' }}>
          {message}
        </p>
      )}
    </div>
  )
}

export function MiniLoader() {
  return (
    <svg className="w-4 h-4 animate-spin inline-block" viewBox="0 0 16 16" fill="none"
      style={{ animationDuration: '1.5s' }}>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i / 8) * Math.PI * 2
        return <line key={i} x1="8" y1="8"
          x2={8 + Math.cos(a) * 6} y2={8 + Math.sin(a) * 6}
          stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.7" />
      })}
      <circle cx="8" cy="8" r="1.5" fill="#d4a843" />
    </svg>
  )
}