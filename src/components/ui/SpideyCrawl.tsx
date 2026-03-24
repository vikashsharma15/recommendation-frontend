import { useState, useEffect } from 'react'

const TIPS = [
  "Hey hero! 🕷️ I'm your AI reading guide!",
  "I've indexed 30,000 articles just for you! 🕸️",
  "Pick your interests — I'll spin the perfect feed! ✨",
  "With great articles comes great responsibility! 📰",
  "Your personalized feed awaits, hero! 🚀",
]

interface Props {
  showBubble?: boolean
}

export default function SpideyCrawl({ showBubble = true }: Props) {
  const [tipIndex, setTipIndex] = useState(0)
  const [bubbleOpen, setBubbleOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBubbleOpen(true), 3000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!bubbleOpen) return
    const t = setInterval(() => setTipIndex(i => (i + 1) % TIPS.length), 3500)
    return () => clearInterval(t)
  }, [bubbleOpen])

  if (!showBubble) return null

  return (
    <>
      {/* Floating trigger button */}
      {!bubbleOpen && (
        <button
          onClick={() => setBubbleOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95"
          style={{
            boxShadow: '0 4px 20px rgba(220,38,38,0.5), 0 0 0 2px rgba(212,168,67,0.3)',
            animation: 'spideyPulse 2s ease-in-out infinite',
          }}
        >
          <img src="/spiderchat.png" alt="Spidey" className="w-full h-full object-cover" />
        </button>
      )}

      {/* Chat bubble */}
      {bubbleOpen && (
        <div
          className="fixed bottom-6 right-6 z-50"
          style={{ animation: 'spideyIn 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        >
          <div
            className="relative max-w-[240px] p-4 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #12101e, #1a1528)',
              border: '1px solid rgba(212,168,67,0.35)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.1)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                style={{ border: '2px solid rgba(212,168,67,0.5)', boxShadow: '0 0 10px rgba(220,38,38,0.3)' }}>
                <img src="/spiderchat.png" alt="Spidey" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black" style={{ color: '#d4a843' }}>Spidey Guide 🕷️</p>
                <div className="flex gap-0.5 mt-0.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full animate-bounce"
                      style={{ background: '#d4a843', animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => setBubbleOpen(false)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all"
                style={{ color: '#5050a0', background: 'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d4a843' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#5050a0' }}
              >
                ✕
              </button>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: '#c0c0d8' }}>
              {TIPS[tipIndex]}
            </p>

            <div className="flex gap-2 mt-3">
              <a href="/register"
                className="flex-1 text-center text-xs py-2 rounded-lg font-black text-black hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)' }}>
                Let's go!
              </a>
              <button
                onClick={() => setBubbleOpen(false)}
                className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#7070a0', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
              >
                Later
              </button>
            </div>
          </div>

          {/* Tail */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 rotate-45"
            style={{ background: '#1a1528', borderRight: '1px solid rgba(212,168,67,0.35)', borderBottom: '1px solid rgba(212,168,67,0.35)' }} />
        </div>
      )}

      <style>{`
        @keyframes spideyIn {
          from { opacity: 0; transform: scale(0.5) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spideyPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(220,38,38,0.5), 0 0 0 2px rgba(212,168,67,0.3); }
          50% { box-shadow: 0 4px 30px rgba(220,38,38,0.8), 0 0 0 4px rgba(212,168,67,0.5); }
        }
      `}</style>
    </>
  )
}
