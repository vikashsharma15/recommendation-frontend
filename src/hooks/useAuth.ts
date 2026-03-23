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

  // Auto-fetch user — only when authenticated AND user not in store
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn:  userService.getMe,
    enabled:  isAuthenticated && !user,  // ← user already hai toh fetch mat karo
    staleTime: 10 * 60 * 1000,           // 10 min — profile baar baar change nahi hoti
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

      // Single /me call — store mein set karo
      const me = await userService.getMe()
      setUser(me.data)

      // Store mein set karne ke baad query cache bhi update karo
      // Taaki useQuery dobara fetch na kare
      qc.setQueryData(['me'], me)

      // Background prefetch — feed instant load
      prefetchRecommendations(qc)

      toast.success(`Welcome back, ${me.data.username}! 🕷️`)
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

  return {
    user: currentUser,
    isAuthenticated,
    register,
    login,
    logout: handleLogout,
    setUser: (u: User) => setUser(u),
  }
}