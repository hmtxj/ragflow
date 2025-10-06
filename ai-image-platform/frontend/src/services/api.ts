import axios, { type AxiosResponse } from 'axios'
import type { 
  ApiResponse, 
  User, 
  ApiConfig, 
  GenerationRequest, 
  GeneratedImage, 
  GenerationHistory,
  PaginatedResponse,
  DashboardStats,
  StyleTag
} from '@/types'
import { useAuthStore } from '@/store/auth'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      toast.error('登录已过期，请重新登录')
      window.location.href = '/login'
    } else if (error.response?.status >= 500) {
      toast.error('服务器错误，请稍后重试')
    } else if (error.message === 'Network Error') {
      toast.error('网络连接失败，请检查网络设置')
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', { email, password }),
  
  register: (email: string, password: string, username: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', { 
      email, 
      password, 
      username 
    }),
  
  logout: () =>
    api.post<ApiResponse<null>>('/auth/logout'),
  
  refreshToken: () =>
    api.post<ApiResponse<{ token: string }>>('/auth/refresh'),
  
  forgotPassword: (email: string) =>
    api.post<ApiResponse<null>>('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<null>>('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) =>
    api.post<ApiResponse<null>>('/auth/verify-email', { token }),
}

// User APIs
export const userAPI = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/user/profile'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<ApiResponse<User>>('/user/profile', data),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<ApiResponse<null>>('/user/change-password', { 
      current_password: currentPassword, 
      new_password: newPassword 
    }),
  
  deleteAccount: () =>
    api.delete<ApiResponse<null>>('/user/account'),
  
  getUsage: () =>
    api.get<ApiResponse<{
      credits_used: number
      credits_remaining: number
      generations_today: number
      total_generations: number
    }>>('/user/usage'),
}

// API Config APIs
export const apiConfigAPI = {
  list: () =>
    api.get<ApiResponse<ApiConfig[]>>('/api-configs'),
  
  create: (data: Omit<ApiConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
    api.post<ApiResponse<ApiConfig>>('/api-configs', data),
  
  update: (id: string, data: Partial<ApiConfig>) =>
    api.put<ApiResponse<ApiConfig>>(`/api-configs/${id}`, data),
  
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/api-configs/${id}`),
  
  test: (id: string) =>
    api.post<ApiResponse<{ success: boolean; message: string }>>(`/api-configs/${id}/test`),
}

// Generation APIs
export const generationAPI = {
  generate: (data: GenerationRequest) =>
    api.post<ApiResponse<GeneratedImage>>('/generate', data),
  
  getHistory: (page = 1, size = 20) =>
    api.get<ApiResponse<PaginatedResponse<GenerationHistory>>>('/generate/history', {
      params: { page, size }
    }),
  
  getImage: (id: string) =>
    api.get<ApiResponse<GeneratedImage>>(`/generate/images/${id}`),
  
  deleteImage: (id: string) =>
    api.delete<ApiResponse<null>>(`/generate/images/${id}`),
  
  likeImage: (id: string) =>
    api.post<ApiResponse<null>>(`/generate/images/${id}/like`),
  
  unlikeImage: (id: string) =>
    api.delete<ApiResponse<null>>(`/generate/images/${id}/like`),
  
  downloadImage: (id: string) =>
    api.get(`/generate/images/${id}/download`, { responseType: 'blob' }),
}

// Style Tags APIs
export const styleTagAPI = {
  list: (category?: string) =>
    api.get<ApiResponse<StyleTag[]>>('/style-tags', {
      params: category ? { category } : {}
    }),
  
  search: (query: string) =>
    api.get<ApiResponse<StyleTag[]>>('/style-tags/search', {
      params: { q: query }
    }),
  
  popular: (limit = 20) =>
    api.get<ApiResponse<StyleTag[]>>('/style-tags/popular', {
      params: { limit }
    }),
}

// Gallery APIs
export const galleryAPI = {
  getPublicImages: (page = 1, size = 20, sort = 'created_at') =>
    api.get<ApiResponse<PaginatedResponse<GeneratedImage>>>('/gallery', {
      params: { page, size, sort }
    }),
  
  getUserImages: (userId: string, page = 1, size = 20) =>
    api.get<ApiResponse<PaginatedResponse<GeneratedImage>>>(`/gallery/user/${userId}`, {
      params: { page, size }
    }),
  
  search: (query: string, page = 1, size = 20) =>
    api.get<ApiResponse<PaginatedResponse<GeneratedImage>>>('/gallery/search', {
      params: { q: query, page, size }
    }),
}

// Dashboard APIs
export const dashboardAPI = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>('/dashboard/stats'),
  
  getRecentActivity: (limit = 10) =>
    api.get<ApiResponse<GenerationHistory[]>>('/dashboard/activity', {
      params: { limit }
    }),
}

// Admin APIs (for enterprise users)
export const adminAPI = {
  getUsers: (page = 1, size = 20) =>
    api.get<ApiResponse<PaginatedResponse<User>>>('/admin/users', {
      params: { page, size }
    }),
  
  getUserStats: () =>
    api.get<ApiResponse<{
      total_users: number
      active_users: number
      new_users_today: number
      total_generations: number
    }>>('/admin/stats'),
  
  updateUserPlan: (userId: string, plan: string) =>
    api.put<ApiResponse<User>>(`/admin/users/${userId}/plan`, { plan }),
  
  banUser: (userId: string, reason: string) =>
    api.post<ApiResponse<null>>(`/admin/users/${userId}/ban`, { reason }),
  
  unbanUser: (userId: string) =>
    api.post<ApiResponse<null>>(`/admin/users/${userId}/unban`),
}

export default api