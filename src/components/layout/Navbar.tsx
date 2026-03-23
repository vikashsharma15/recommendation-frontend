import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Settings, LogOut, User, ChevronDown, Newspaper, BookOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

function getInitials(username: string) { return username.slice(0, 2).toUpperCase() }

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="sticky top-0 z-50"
      style={{ background: 'rgba(6,6,14,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to={isAuthenticated ? '/feed' : '/'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #d4a843, #c8922a)', boxShadow: '0 0 12px rgba(212,168,67,0.4)' }}>
            <BookOpen className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-lg tracking-tight text-white">
            Recom<span style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>r</span>
          </span>
        </Link>

        {/* Nav */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/feed"
              className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all', location.pathname === '/feed' ? 'text-white' : 'text-gray-500 hover:text-white')}
              style={location.pathname === '/feed' ? { background: 'rgba(212,168,67,0.1)', color: '#d4a843' } : {}}>
              <Newspaper className="w-4 h-4" />
              Feed
            </Link>
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium transition-colors" style={{ color: '#8080a8' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#d4a843' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8080a8' }}>
                Sign in
              </Link>
              <Link to="/register"
                className="text-sm font-black px-4 py-2 rounded-xl text-black transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #d4a843, #f5e07a)', boxShadow: '0 4px 12px rgba(212,168,67,0.3)' }}>
                Get started
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 p-1.5 rounded-xl transition-all"
                style={{ background: menuOpen ? 'rgba(212,168,67,0.1)' : 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.08)' }}
                onMouseLeave={e => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-black"
                  style={{ background: 'linear-gradient(135deg, #d4a843, #c8922a)', boxShadow: '0 0 10px rgba(212,168,67,0.3)' }}>
                  {user?.avatar_url
                    ? <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    : getInitials(user?.full_name || 'U')}
                </div>
                <span className="hidden md:block text-sm font-semibold max-w-[100px] truncate" style={{ color: '#e0e0f0' }}>
                  {user?.full_name}
                </span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', menuOpen && 'rotate-180')} style={{ color: '#50508a' }} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
                  style={{ background: '#12101e', border: '1px solid rgba(212,168,67,0.2)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', animation: 'scaleIn 0.15s ease' }}>
                  {/* <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}> */}
                    {/* <p className="text-sm font-black text-white truncate">@{user?.username}</p> */}
                    {/* <p className="text-xs truncate mt-0.5" style={{ color: '#50508a' }}>{user?.email}</p> */}
                  {/* </div> */}
                  <div className="p-1.5">
                    <button onClick={() => { navigate('/profile'); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all text-left"
                      style={{ color: '#c0c0d8' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.08)'; (e.currentTarget as HTMLElement).style.color = '#d4a843' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#c0c0d8' }}>
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button onClick={() => { navigate('/settings'); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all text-left"
                      style={{ color: '#c0c0d8' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.08)'; (e.currentTarget as HTMLElement).style.color = '#d4a843' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#c0c0d8' }}>
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="my-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                    <button onClick={() => { logout(); setMenuOpen(false) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all text-left"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes scaleIn { from{opacity:0;transform:scale(0.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }`}</style>
    </header>
  )
}