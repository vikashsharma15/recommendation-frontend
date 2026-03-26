import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { useAuthStore } from '@/store/auth.store'
import { extractError } from '@/services/api'
import { prefetchRecommendations } from '@/hooks/useRecommendations'
import type { RegisterPayload, LoginPayload, User } from '@/types'

export function useAuth() {
  const { user, isAuthenticated, setTokens, setUser, logout } = useAuthStore()
  const navigate = useNavigate()
  const qc       = useQueryClient()

  // Fetch user only when authenticated AND not in store
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn:  userService.getMe,
    enabled:  isAuthenticated && !user,
    staleTime: 10 * 60 * 1000,
    retry: false,
  })

  const currentUser = user || meData?.data || null
  if (meData?.data && !user) setUser(meData.data)

  const register = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (_, payload) => {
      toast.success('Account created! Sign in to continue.')
      navigate('/login', { state: { username: payload.username } })
    },
    onError: (err) => toast.error(extractError(err)),
  })

  const login = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (res) => {
      setTokens(res.data.access_token, res.data.refresh_token)

      // Single /me call
      const me = await userService.getMe()
      setUser(me.data)
      qc.setQueryData(['me'], me)

      // Smart greeting — new user vs returning
      const u = me.data
      const isNewUser = !u.bio && !u.full_name && (u.username_change_count || 0) === 0
      if (isNewUser) {
        toast.success(`Welcome to Recomr, ${u.username}! 🕷️`)
      } else {
        toast.success(`Welcome, ${u.full_name || u.username}! 🕷️`)
      }

      // Background prefetch
      prefetchRecommendations(qc)
      navigate('/feed')
    },
    onError: (err) => toast.error(extractError(err)),
  })

  const handleLogout = () => {
    logout()
    qc.removeQueries({ queryKey: ['recommendations'] })
    qc.removeQueries({ queryKey: ['me'] })
    qc.clear()
    navigate('/')
    toast('Logged out', { icon: '👋' })
  }

  // ── Refresh user from server ───────────────────────────
  // Settings/Profile save ke baad call karo
  const refreshUser = async () => {
    const me = await userService.getMe()
    setUser(me.data)
    qc.setQueryData(['me'], me)
    return me.data
  }

  return {
    user: currentUser,
    isAuthenticated,
    register,
    login,
    logout: handleLogout,
    setUser: (u: User) => setUser(u),
    refreshUser,
  }
}