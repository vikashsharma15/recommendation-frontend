import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

// Lazy loaded chunks
const Landing  = lazy(() => import('@/pages/Landing'))
const Login    = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Feed     = lazy(() => import('@/pages/Feed'))
const Profile  = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#06060e' }}>
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10 animate-spin" viewBox="0 0 40 40" fill="none" style={{ animationDuration: '2s' }}>
          {[0,1,2,3,4,5,6,7].map(i => {
            const a = (i/8)*Math.PI*2
            return <line key={i} x1="20" y1="20" x2={20+Math.cos(a)*17} y2={20+Math.sin(a)*17} stroke="#d4a843" strokeWidth="0.8" strokeOpacity="0.6" />
          })}
          {[6,11,16].map(r => <circle key={r} cx="20" cy="20" r={r} fill="none" stroke="#d4a843" strokeWidth="0.6" strokeOpacity="0.4" />)}
          <circle cx="20" cy="20" r="2" fill="#d4a843" />
        </svg>
        <p className="text-xs font-medium" style={{ color: '#50508a' }}>Loading...</p>
      </div>
    </div>
  )
}

// Public route — logged in user ko feed pe bhejo
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/feed" replace /> : <>{children}</>
}

// Smart root — logged in = feed, logged out = landing
function RootRedirect() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/feed" replace /> : <Landing />
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Root — smart redirect */}
        <Route path="/" element={<RootRedirect />} />

        {/* Auth pages — logged in users ko redirect karo */}
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected — JWT required */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/feed"     element={<Feed />} />
            <Route path="/profile"  element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 → root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}