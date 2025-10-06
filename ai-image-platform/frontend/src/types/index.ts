export interface User {
  id: string
  email: string
  username: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  credits: number
  created_at: string
  updated_at: string
}

export interface ApiConfig {
  id: string
  name: string
  type: 'text' | 'image'
  provider: string
  base_url: string
  api_key: string
  model: string
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface StyleTag {
  id: string
  name: string
  category: string
  type: 'positive' | 'negative'
  description?: string
  popularity: number
}

export interface GenerationRequest {
  prompt: string
  negative_prompt?: string
  style_tags: string[]
  ratio: string
  quality: 'normal' | '2K' | '4K'
  api_config_id: string
  is_fop_mode: boolean
}

export interface GeneratedImage {
  id: string
  url: string
  thumbnail_url?: string
  prompt: string
  negative_prompt?: string
  style_tags: string[]
  ratio: string
  quality: string
  user_id: string
  api_config_id: string
  generation_time: number
  file_size: number
  is_public: boolean
  likes: number
  downloads: number
  created_at: string
  updated_at: string
}

export interface GenerationHistory {
  id: string
  user_id: string
  image: GeneratedImage
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error_message?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

export interface DashboardStats {
  total_generations: number
  total_credits_used: number
  popular_styles: StyleTag[]
  recent_images: GeneratedImage[]
}