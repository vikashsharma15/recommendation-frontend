import { api } from './api'
import type { ApiResponse, Token, User, RegisterPayload, LoginPayload } from '@/types'

export const authService = {
  async register(payload: RegisterPayload): Promise<ApiResponse<User>> {
    const res = await api.post('/auth/register', payload)
    return res.data
  },

  async login(payload: LoginPayload): Promise<ApiResponse<Token>> {
    const res = await api.post('/auth/login', payload)
    return res.data
  },

  async refresh(refreshToken: string): Promise<ApiResponse<Token>> {
    const res = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return res.data
  },

  async getCategories(): Promise<string[]> {
    const res = await api.get('/articles/categories')
    return res.data.data.categories
  },
}