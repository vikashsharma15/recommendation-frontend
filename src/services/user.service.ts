import { api } from './api'
import type { ApiResponse, User } from '@/types'

export const userService = {
  async getMe(): Promise<ApiResponse<User>> {
    const res = await api.get('/users/me')
    return res.data
  },

  async updatePreferences(interests: string[]): Promise<ApiResponse<User>> {
    const res = await api.put('/users/me/preferences', { interests })
    return res.data
  },

  async updateProfile(data: {
    full_name?: string
    bio?: string
    avatar_url?: string
    cover_url?: string
    twitter?: string
    linkedin?: string
    github?: string
  }): Promise<ApiResponse<User>> {
    const res = await api.patch('/users/me', data)
    return res.data
  },

 async updateUsername(data: { username: string }): Promise<ApiResponse<User>> {
  const res = await api.patch('/users/me/username', data)
  return res.data
}
}