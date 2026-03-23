import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, Sparkles, Shield, Zap, Globe, Trophy,
  TrendingUp, Microscope, ArrowRight, Check, Users, Clock, Database
} from 'lucide-react'
import SpideyCrawl from '@/components/ui/SpideyCrawl'

function Gold({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      background: 'linear-gradient(135deg, #d4a843 0%, #f5e07a 45%, #c8922a 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
    }}>
      {children}
    </span>
  )
}

const features = [
  { icon: Sparkles, title: 'Semantic Intelligence', desc: 'We understand context, not just keywords. "Climate policy" finds "carbon tax" — automatically.', col: 'col-span-2', glow: '#6366f1' },
  { icon: Zap, title: '< 50ms', desc: 'Redis + Pinecone. Instant.', col: 'col-span-1', glow: '#f59e0b' },
  { icon: Shield, title: 'Zero Compromise', desc: 'JWT · bcrypt · rate limits. Built for scale.', col: 'col-span-1', glow: '#10b981' },
  { icon: Database, title: '30,000+ Articles', desc: 'Indexed, embedded, and ready.', col: 'col-span-1', glow: '#d4a843' },
  { icon: Sparkles, title: 'Gets Smarter Daily', desc: 'Every like, skip, and scroll teaches your feed what matters.', col: 'col-span-2', glow: '#8b5cf6' },
]

const categories = [
  { icon: Globe, label: 'World', sub: 'Politics · Geopolitics · Global', color: '#3b82f6' },
  { icon: Trophy, label: 'Sports', sub: 'Scores · Stats · Stories', color: '#f59e0b' },
  { icon: TrendingUp, label: 'Business', sub: 'Markets · Startups · Finance', color: '#10b981' },
  { icon: Microscope, label: 'Science & Tech', sub: 'AI · Research · Breakthroughs', color: '#8b5cf6' },
]

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / 60
    const t = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(t) }
      else setCount(Math.floor(start))
    }, 20)
    return () => clearInterval(t)
  }, [target])
  return <>{count.toLocaleString()}{suffix}</>
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setStatsVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: '#06060e', color: '#e0e0f0', minHeight: '100vh' }}>

      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(6,6,14,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(212,168,67,0.12)' : '1px solid transparent',
        }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4a843, #c8922a)', boxShadow: '0 0 16px rgba(212,168,67,0.5)' }}>
              <BookOpen className="w-4 h-4 text-black" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">Recom<Gold>r</Gold></span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
              style={{ color: '#8080a8' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d4a843'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8080a8'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              Sign in
            </Link>
            <Link to="/register"
              className="text-sm font-black px-5 py-2.5 rounded-xl text-black transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 4px 16px rgba(212,168,67,0.4)' }}>
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 text-center overflow-hidden">
        {/* Gold spider watermark — pure CSS, no Lottie, no white box */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 1 }}>
          <img src="/spiderchat.png" alt="" aria-hidden="true"
            style={{ width: 520, height: 520, opacity: 0.05, filter: 'sepia(1) saturate(2) hue-rotate(5deg) brightness(0.9)', objectFit: 'contain' }} />
        </div>

        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(212,168,67,0.07) 0%, transparent 70%)',
          zIndex: 2
        }} />
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(212,168,67,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,67,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px', zIndex: 2
        }} />

        <div className="relative max-w-4xl mx-auto w-full" style={{ zIndex: 10 }}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-8"
            style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: '#d4a843' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#d4a843' }} />
            AI-Powered · 30,000+ Articles · Free Forever
          </div>

          {/* CEO-level copy */}
          <h1 className="font-black leading-[1.02] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', color: '#f0f0fa', letterSpacing: '-0.03em' }}>
            The internet has<br />too much noise.
          </h1>
          <h2 className="font-black leading-[1.02] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', letterSpacing: '-0.03em' }}>
            <Gold>We cut through it.</Gold>
          </h2>

          <p className="max-w-2xl mx-auto mb-10 font-light leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#60608a' }}>
            Recomr uses semantic AI to surface what you'd actually want to read —
            before you even know you want to read it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link to="/register"
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-black text-base transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 8px 32px rgba(212,168,67,0.45)' }}>
              Build my feed — it's free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login"
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105"
              style={{ border: '1px solid rgba(212,168,67,0.3)', color: '#d4a843', background: 'rgba(212,168,67,0.05)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.12)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.05)' }}>
              Already a member
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap">
            {['No credit card', 'No spam', 'No algorithm games'].map(t => (
              <div key={t} className="flex items-center gap-1.5 text-sm" style={{ color: '#50508a' }}>
                <Check className="w-3.5 h-3.5" style={{ color: '#d4a843' }} />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30" style={{ zIndex: 10 }}>
          <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '1px solid rgba(212,168,67,0.4)' }}>
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: '#d4a843' }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6" style={{ borderTop: '1px solid rgba(212,168,67,0.1)', background: 'rgba(212,168,67,0.02)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Database, value: 30000, suffix: '+', label: 'Articles indexed' },
            { icon: Clock, value: 50, suffix: 'ms', label: 'Avg response' },
            { icon: Users, value: 4, suffix: '', label: 'Curated categories' },
            { icon: Sparkles, value: 100, suffix: '%', label: 'Free forever' },
          ].map(({ icon: Icon, value, suffix, label }) => (
            <div key={label} className="group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,168,67,0.1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,168,67,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.05)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(212,168,67,0.1)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
              <Icon className="w-5 h-5 mx-auto mb-3" style={{ color: '#d4a843' }} />
              <p className="text-3xl font-black mb-1"
                style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {statsVisible ? <Counter target={value} suffix={suffix} /> : `0${suffix}`}
              </p>
              <p className="text-xs font-medium" style={{ color: '#50508a' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: '#d4a843' }}>Why Recomr</p>
            <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Not built for engagement.<br /><Gold>Built for insight.</Gold>
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: '#50508a' }}>
              No clickbait. No outrage loops. Just articles worth your time.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc, col, glow }) => (
              <div key={title}
                className={`${col} group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default`}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${glow}50`; (e.currentTarget as HTMLElement).style.background = `${glow}08` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${glow}20`, border: `1px solid ${glow}40` }}>
                  <Icon className="w-5 h-5" style={{ color: glow }} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#50508a' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6" style={{ background: 'rgba(212,168,67,0.02)', borderTop: '1px solid rgba(212,168,67,0.08)', borderBottom: '1px solid rgba(212,168,67,0.08)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: '#d4a843' }}>Coverage</p>
            <h2 className="font-black text-white mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>
              Four lenses.<br /><Gold>One clear picture.</Gold>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = `1px solid ${color}50`; (e.currentTarget as HTMLElement).style.background = `${color}08`; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}20` }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = '1px solid rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${color}15`, border: `1px solid ${color}40` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <p className="font-bold text-white mb-1">{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#50508a' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        {/* Gold spider watermark in CTA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img src="/spiderchat.png" alt="" aria-hidden="true"
            style={{ width: 380, height: 380, opacity: 0.04, filter: 'sepia(1) saturate(2) hue-rotate(5deg)', objectFit: 'contain' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 70% at 50% 50%, rgba(212,168,67,0.07) 0%, transparent 70%)'
        }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: '#d4a843' }}>
            ✦ Start now ✦
          </p>
          <h2 className="font-black text-white mb-4 leading-tight" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Your next great read<br />is one click away.
          </h2>
          <p className="text-lg mb-10" style={{ color: '#50508a' }}>
            Join readers who stopped doom-scrolling and started reading with intention.
          </p>
          <Link to="/register"
            className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-black text-black text-base transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 8px 40px rgba(212,168,67,0.5)' }}>
            Start for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8" style={{ borderTop: '1px solid rgba(212,168,67,0.1)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4a843, #c8922a)' }}>
              <BookOpen className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-black" style={{ color: '#d4a843' }}>Recomr</span>
          </div>
          <p className="text-xs" style={{ color: '#30304a' }}>© 2026 Recomr · FastAPI · React · Pinecone · Redis</p>
          <div className="flex items-center gap-5 text-xs" style={{ color: '#40406a' }}>
            <Link to="/register" className="transition-colors hover:text-white">Get started</Link>
            <Link to="/login" className="transition-colors hover:text-white">Sign in</Link>
          </div>
        </div>
      </footer>

      <SpideyCrawl showBubble={true} />
    </div>
  )
}