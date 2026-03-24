import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import PageLoader from '@/components/ui/PageLoader'

// Lazy loaded pages
const Landing  = lazy(() => import('@/pages/Landing'))
const Login    = lazy(() => import('@/pages/Login'))
const Register = lazy(() => import('@/pages/Register'))
const Feed     = lazy(() => import('@/pages/Feed'))
const Profile  = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))

// Public route — logged in user ko feed pe bhejo
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/feed" replace /> : <>{children}</>
}

// Smart root redirect
function RootRedirect() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/feed" replace /> : <Landing />
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"         element={<RootRedirect />} />
        <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/feed"     element={<Feed />} />
            <Route path="/profile"  element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}