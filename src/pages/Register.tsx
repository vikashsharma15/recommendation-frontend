import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, BookOpen, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { WebSpinner } from '@/components/ui/WebLoader'
import InterestSelector from '@/components/auth/InterestSelector'
import type { InterestCategory } from '@/types'

function Gold({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {children}
    </span>
  )
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ]
  if (!password) return null
  return (
    <div className="mt-2 flex gap-3">
      {checks.map(({ label, pass }) => (
        <div key={label} className="flex items-center gap-1 text-xs">
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${pass ? 'bg-emerald-500' : 'bg-gray-700'}`}>
            {pass && <Check className="w-2 h-2 text-white" />}
          </div>
          <span style={{ color: pass ? '#10b981' : '#50508a' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

const STEPS = ['Account', 'Interests'] as const
type Step = typeof STEPS[number]

// Context-aware Spidey messages
const SPIDEY_MSGS: Record<string, string> = {
  default_Account: "Let's build your secret identity, hero! 🕷️",
  username: "3-30 chars, letters & numbers only. No spaces!",
  email: "Use a real email — no fake domains allowed 🕸️",
  password: "Min 8 chars + 1 uppercase + 1 number. Strong passwords save lives!",
  password_show: "Password revealed! Make sure nobody's watching 👀",
  default_Interests: "Pick 1 to 4 topics — your AI feed spins around these! 🕸️",
  interests: "More topics = richer recommendations. Max 4!",
}

export default function Register() {
  const { register } = useAuth()
  const [step, setStep] = useState<Step>('Account')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState('')
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    interests: [] as InterestCategory[],
  })

  function setField(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validateStep1() {
    const errs: Record<string, string> = {}
    if (form.username.length < 3) errs.username = 'At least 3 characters'
    if (form.username.length > 30) errs.username = 'Max 30 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Letters, numbers & underscores only'
    if (!form.email.includes('@')) errs.email = 'Valid email required'
    if (form.password.length < 8) errs.password = 'At least 8 characters'
    if (!/[A-Z]/.test(form.password)) errs.password = 'Must have 1 uppercase letter'
    if (!/[0-9]/.test(form.password)) errs.password = 'Must have 1 number'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (validateStep1()) setStep('Interests')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.interests.length === 0) { setErrors({ interests: 'Select at least one' }); return }
    register.mutate(form)
  }

  const inputStyle = (field: string) => ({
    background: 'rgba(255,255,255,0.05)',
    border: errors[field] ? '1px solid #ef4444' : focused === field ? '1px solid rgba(212,168,67,0.6)' : '1px solid rgba(255,255,255,0.1)',
    color: 'white',
  })

  // Determine spidey message
  const spideyMsg = showPassword && focused === 'password'
    ? SPIDEY_MSGS.password_show
    : focused && SPIDEY_MSGS[focused]
    ? SPIDEY_MSGS[focused]
    : SPIDEY_MSGS[`default_${step}`]

  return (
    <div className="min-h-screen flex" style={{ background: '#06060e' }}>

      {/* Left panel — spider embedded */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
        style={{ borderRight: '1px solid rgba(212,168,67,0.1)' }}>

        {/* Web SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 600 600" fill="none" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2
            return <line key={i} x1="300" y1="300" x2={300 + Math.cos(a) * 400} y2={300 + Math.sin(a) * 400} stroke="#d4a843" strokeWidth="0.8" />
          })}
          {[50, 110, 180, 250, 320].map(r => (
            <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#d4a843" strokeWidth="0.6" />
          ))}
        </svg>

        {/* Spiderman PNG — centered, embedded */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/spiderchat.png" alt="" aria-hidden="true"
            style={{
              width: 420, height: 420,
              opacity: 0.18,
              filter: 'sepia(0.8) saturate(2.5) hue-rotate(10deg) brightness(0.85)',
              objectFit: 'contain',
            }} />
        </div>

        {/* Radial glow behind spider */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(212,168,67,0.06) 0%, transparent 70%)'
        }} />

        {/* Text content */}
        <div className="relative z-10 text-center px-12">
          <h2 className="text-3xl font-black text-white mb-2">Join Recomr</h2>
          <p className="mb-6" style={{ color: '#60608a' }}>30,000+ articles curated for you.</p>
          <div className="space-y-2.5">
            {['Semantic AI matching', 'Redis-cached speed', 'Personalized feed'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#8080a8' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(212,168,67,0.2)' }}>
                  <Check className="w-2.5 h-2.5" style={{ color: '#d4a843' }} />
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto relative">
        <div className="w-full max-w-sm relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4a843, #c8922a)' }}>
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-white">Recom<Gold>r</Gold></span>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-5">
            {STEPS.map((s, i) => {
              const active = s === step
              const done = STEPS.indexOf(step) > i
              return (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
                    style={{
                      background: done || active ? 'linear-gradient(135deg, #d4a843, #f5e07a)' : 'rgba(255,255,255,0.05)',
                      border: done || active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: done || active ? 'black' : '#50508a',
                    }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: active ? '#d4a843' : '#50508a' }}>{s}</span>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-px" style={{ background: done ? 'rgba(212,168,67,0.5)' : 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Spidey guide — context aware */}
          <div className="flex items-center gap-3 p-3 rounded-xl mb-5 transition-all duration-300"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(212,168,67,0.3)' }}>
              <img src="/spiderchat.png" alt="Spidey" className="w-full h-full object-contain"
                style={{ filter: 'sepia(1) saturate(3) hue-rotate(5deg)' }} />
            </div>
            <p className="text-xs leading-relaxed font-medium transition-all duration-300" style={{ color: '#d4a843' }}>
              {spideyMsg}
            </p>
          </div>

          {step === 'Account' && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9090b0' }}>Username</label>
                <input value={form.username} onChange={e => setField('username', e.target.value)}
                  onFocus={() => setFocused('username')} onBlur={() => setFocused('')}
                  placeholder="vikash_sharma" autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl text-sm placeholder-gray-600 outline-none transition-all"
                  style={inputStyle('username')} />
                {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9090b0' }}>Email</label>
                <input value={form.email} onChange={e => setField('email', e.target.value)}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                  type="email" placeholder="you@gmail.com" autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl text-sm placeholder-gray-600 outline-none transition-all"
                  style={inputStyle('email')} />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block" style={{ color: '#9090b0' }}>Password</label>
                <div className="relative">
                  <input value={form.password} onChange={e => setField('password', e.target.value)}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 pr-12 rounded-xl text-sm placeholder-gray-600 outline-none transition-all"
                    style={inputStyle('password')} />
                  <button type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: showPassword ? '#d4a843' : '#50508a' }}>
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              <button type="submit"
                className="relative w-full overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-black transition-all hover:scale-[1.02] group"
                style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 4px 20px rgba(212,168,67,0.35)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'shimmer 1.5s infinite' }} />
                Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <style>{`@keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(200%)} }`}</style>
            </form>
          )}

          {step === 'Interests' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <InterestSelector
                selected={form.interests}
                onChange={interests => {
                  setForm(f => ({ ...f, interests }))
                  setFocused('interests')
                }}
                error={errors.interests}
                dark
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep('Account')}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#9090b0', background: 'rgba(255,255,255,0.03)' }}>
                  Back
                </button>
                <button type="submit" disabled={register.isPending}
                  className="relative flex-1 overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl font-black text-black transition-all hover:scale-[1.02] disabled:opacity-80 group"
                  style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: register.isPending ? 'none' : '0 4px 20px rgba(212,168,67,0.35)' }}>
                  {register.isPending ? (<><WebSpinner size={16} /> Creating...</>) : 'Create account'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-xs mt-5" style={{ color: '#50508a' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:opacity-80" style={{ color: '#d4a843' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}