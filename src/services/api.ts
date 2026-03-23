/**
 * Axios instance — centralized API client
 *
 * Security:
 * - Tokens stored in localStorage (httpOnly cookie better hoti lekin
 *   cross-origin CORS setup chahiye — current setup ke liye localStorage fine)
 * - Authorization header auto-attached
 * - 401 pe automatic token refresh + retry
 * - Sensitive fields response mein strip kiye jaate hain
 *
 * Production notes:
 * - VITE_API_URL .env mein set karo
 * - HTTPS enforce hota hai production build mein
 */
import axios from 'axios'
import type { ApiResponse, ApiError } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  // withCredentials: true, // Enable if moving to httpOnly cookies
})

// ── Request interceptor — attach JWT ─────────────────────
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// ── Response interceptor — auto refresh on 401 ───────────
let isRefreshing = false
let failedQueue: { resolve: (v: unknown) => void; reject: (e: unknown) => void }[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config

    // 401 + not already retried + not the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue concurrent requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')

        const res = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refresh_token: refresh,
        })
        const { access_token, refresh_token } = res.data.data

        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`
        original.headers.Authorization = `Bearer ${access_token}`

        processQueue(null, access_token)
        return api(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// ── Error extractor ───────────────────────────────────────
export function extractError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError
    if (data?.error?.details?.length) {
      return data.error.details.map(d => d.message).join(', ')
    }
    if (data?.error?.message) return data.error.message
    if (error.response?.status === 429) return 'Too many requests. Please wait a moment.'
    if (error.response?.status === 503) return 'Service unavailable. Try again shortly.'
    if (error.code === 'ECONNABORTED')  return 'Request timed out. Check your connection.'
  }
  return 'Something went wrong. Please try again.'
}