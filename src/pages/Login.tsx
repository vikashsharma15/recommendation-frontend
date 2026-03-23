import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, BookOpen, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { WebSpinner } from '@/components/ui/WebLoader'

function Gold({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {children}
    </span>
  )
}

const SPIDEY_MSGS: Record<string, string> = {
  default:       "Hey hero! Enter your credentials to swing into your feed! 🕷️",
  username:      "Username is case-insensitive — 'Vikash' = 'vikash' 🕸️",
  password:      "Click the 👁️ icon to reveal your password, hero!",
  password_show: "Password revealed — nobody watching? Good. 👀",
  loading:       "Spinning your web... Hold tight! 🕸️",
  error:         "Wrong credentials. Even heroes slip up! Try again 🕷️",
}

export default function Login() {
  const { login } = useAuth()
  const location = useLocation()
  const prefill = (location.state as { username?: string })?.username || ''
  const [form, setForm]             = useState({ username: prefill, password: '' })
  const [showPassword, setShowPwd]  = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [focused, setFocused]       = useState('default')

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.username.trim()) errs.username = 'Username is required'
    if (!form.password)        errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) login.mutate(form)
  }

  const msgKey = login.isPending ? 'loading' : login.isError ? 'error'
    : showPassword && focused === 'password' ? 'password_show'
    : SPIDEY_MSGS[focused] ? focused : 'default'

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all"

  return (
    <div className="min-h-screen flex" style={{ background: '#06060e' }}>

      {/* Left panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
        style={{ borderRight: '1px solid rgba(212,168,67,0.1)' }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" viewBox="0 0 600 600" fill="none" preserveAspectRatio="xMidYMid slice">
          {Array.from({length:16}).map((_,i) => { const a=(i/16)*Math.PI*2; return <line key={i} x1="300" y1="300" x2={300+Math.cos(a)*400} y2={300+Math.sin(a)*400} stroke="#d4a843" strokeWidth="0.8"/> })}
          {[50,110,180,250,320].map(r => <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#d4a843" strokeWidth="0.6"/>)}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img src="/spiderchat.png" alt="" style={{ width:400, height:400, opacity:0.15, filter:'sepia(0.8) saturate(2.5) hue-rotate(10deg)', objectFit:'contain' }} />
        </div>
        <div className="relative z-10 text-center px-12">
          <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
          <p style={{ color:'#60608a' }}>Your personalized feed is waiting.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,#d4a843,#c8922a)' }}>
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-white">Recom<Gold>r</Gold></span>
          </div>

          <h1 className="text-2xl font-black text-white mb-1">Sign in</h1>
          <p className="text-sm mb-6" style={{ color:'#50508a' }}>
            New here?{' '}
            <Link to="/register" className="font-semibold hover:opacity-80" style={{ color:'#d4a843' }}>Create account</Link>
          </p>

          {/* Spidey guide */}
          <div className="flex items-center gap-3 p-3 rounded-xl mb-5"
            style={{ background:'rgba(212,168,67,0.08)', border:'1px solid rgba(212,168,67,0.2)' }}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
              style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(212,168,67,0.3)' }}>
              <img src="/spiderchat.png" alt="Spidey" className="w-full h-full object-contain"
                style={{ filter:'sepia(1) saturate(3) hue-rotate(5deg)' }} />
            </div>
            <p className="text-xs leading-relaxed font-medium" style={{ color:'#d4a843' }}>
              {SPIDEY_MSGS[msgKey]}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'#9090b0' }}>Username</label>
              <input value={form.username} onChange={e => set('username', e.target.value)}
                onFocus={() => setFocused('username')} onBlur={() => setFocused('default')}
                placeholder="your_username" autoComplete="username"
                className={inputCls}
                style={{ background:'rgba(255,255,255,0.05)', border: errors.username ? '1px solid #ef4444' : focused==='username' ? '1px solid rgba(212,168,67,0.6)' : '1px solid rgba(255,255,255,0.1)' }} />
              {errors.username && <p className="text-xs text-red-400 mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'#9090b0' }}>Password</label>
              <div className="relative">
                <input value={form.password} onChange={e => set('password', e.target.value)}
                  onFocus={() => setFocused('password')} onBlur={() => setFocused('default')}
                  type={showPassword ? 'text' : 'password'} placeholder="Your password" autoComplete="current-password"
                  className={`${inputCls} pr-12`}
                  style={{ background:'rgba(255,255,255,0.05)', border: errors.password ? '1px solid #ef4444' : focused==='password' ? '1px solid rgba(212,168,67,0.6)' : '1px solid rgba(255,255,255,0.1)' }} />
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: showPassword ? '#d4a843' : '#50508a' }}>
                  {showPassword ? <Eye className="w-4 h-4"/> : <EyeOff className="w-4 h-4"/>}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            {login.isError && (
              <div className="p-3 rounded-xl text-sm text-red-400" style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)' }}>
                Invalid credentials. Try again.
              </div>
            )}

            {/* Futuristic submit button */}
            <button type="submit" disabled={login.isPending}
              className="relative w-full overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-black transition-all hover:scale-[1.02] disabled:opacity-80 mt-2 group"
              style={{ background:'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: login.isPending ? 'none' : '0 4px 20px rgba(212,168,67,0.4)' }}>
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: login.isPending ? 'none' : 'shimmer 1.5s infinite' }} />
              {login.isPending ? (
                <>
                  <WebSpinner size={18} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`@keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(200%)} }`}</style>
    </div>
  )
}