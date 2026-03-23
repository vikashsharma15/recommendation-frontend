export type InterestCategory = 'World' | 'Sports' | 'Business' | 'Science/Technology'

export type InteractionAction = 'viewed' | 'liked' | 'skipped'

export interface User {
  id: number
  username: string
  full_name?: string
  email: string
  interests: InterestCategory[]
  created_at: string
  bio?: string
  avatar_url?: string
  cover_url?: string
  twitter?: string
  linkedin?: string
  github?: string
  username_change_count?: number
  username_changed_at?: string
}

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface Article {
  article_id: string
  title: string
  description: string
  category: string
  score: number
  url?: string        // source article URL
}

export interface RecommendResponse {
  user_id: number
  username: string
  recommendations: Article[]
  groq_summary: string | null
}

export interface Meta {
  page: number
  page_size: number
  total: number
  timestamp: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta: Meta | null
  request_id: string
}

export interface ErrorDetail {
  field: string
  issue: string
  message: string
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    status: number
    details?: ErrorDetail[]
  }
  request_id: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  interests: InterestCategory[]
}

export interface LoginPayload {
  username: string
  password: string
}