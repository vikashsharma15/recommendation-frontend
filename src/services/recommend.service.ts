import { api } from './api'
import type { ApiResponse, RecommendResponse } from '@/types'

export const recommendService = {
  async getRecommendations(page = 1, pageSize = 10): Promise<ApiResponse<RecommendResponse>> {
    const res = await api.get('/recommend', { params: { page, page_size: pageSize } })
    return res.data
  },

  async logInteraction(articleId: string, action: 'viewed' | 'liked' | 'skipped') {
    const res = await api.post('/recommend/interact', {
      article_id: articleId,
      action,
    })
    return res.data
  },
}   