import type { InterestCategory } from '@/types'
import { Globe, Trophy, TrendingUp, Microscope } from 'lucide-react'

const CATEGORIES: {
  value: InterestCategory
  label: string
  icon: React.ElementType
  color: string
  glow: string
}[] = [
  { value: 'World', label: 'World News', icon: Globe, color: '#3b82f6', glow: 'rgba(59,130,246,0.2)' },
  { value: 'Sports', label: 'Sports', icon: Trophy, color: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
  { value: 'Business', label: 'Business', icon: TrendingUp, color: '#10b981', glow: 'rgba(16,185,129,0.2)' },
  { value: 'Science/Technology', label: 'Science & Tech', icon: Microscope, color: '#8b5cf6', glow: 'rgba(139,92,246,0.2)' },
]

interface Props {
  selected: InterestCategory[]
  onChange: (v: InterestCategory[]) => void
  error?: string
  dark?: boolean
}

export default function InterestSelector({ selected, onChange, error, dark }: Props) {
  function toggle(cat: InterestCategory) {
    if (selected.includes(cat)) onChange(selected.filter(c => c !== cat))
    else if (selected.length < 4) onChange([...selected, cat])
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(({ value, label, icon: Icon, color, glow }) => {
          const isSelected = selected.includes(value)
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              className="relative flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: isSelected
                  ? (dark ? glow : `${color}15`)
                  : dark ? 'rgba(255,255,255,0.03)' : 'white',
                border: isSelected
                  ? `2px solid ${color}80`
                  : dark ? '1px solid rgba(255,255,255,0.08)' : '2px solid #e2e8f0',
                boxShadow: isSelected ? `0 0 20px ${glow}` : 'none',
              }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: isSelected ? `${color}25` : dark ? 'rgba(255,255,255,0.05)' : '#f8fafc', border: `1px solid ${color}40` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: isSelected ? (dark ? 'white' : color) : dark ? '#9090b0' : '#475569' }}>
                {label}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: color }}>
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-red-400 mt-1">⚠ {error}</p>}
    </div>
  )
}