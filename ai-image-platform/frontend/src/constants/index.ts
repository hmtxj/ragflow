export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 正方形', width: 1024, height: 1024 },
  { value: '2:3', label: '2:3 竖版（韩漫/Pixiv常用）', width: 800, height: 1200 },
  { value: '3:2', label: '3:2 横版', width: 1200, height: 800 },
  { value: '4:3', label: '4:3 横版', width: 1024, height: 768 },
  { value: '16:9', label: '16:9 横版', width: 1280, height: 720 },
  { value: '9:16', label: '9:16 竖版', width: 720, height: 1280 },
  { value: '5:7', label: '5:7 竖版（绘本/插画常用）', width: 720, height: 1008 },
  { value: '7:5', label: '7:5 横版（海报/封面常用）', width: 1008, height: 720 },
] as const

export const QUALITY_OPTIONS = [
  { value: 'normal', label: '普通', description: '适合预览和快速生成' },
  { value: '2K', label: '2K高清', description: '适合打印和专业用途' },
  { value: '4K', label: '4K超清', description: '最高质量，适合商业用途' },
] as const

export const STYLE_CATEGORIES = [
  { id: 'great-practice', name: 'Great Practice', icon: '⭐' },
  { id: 'style', name: 'Style', icon: '🎨' },
  { id: 'weather', name: 'Weather', icon: '🌤️' },
  { id: 'environment', name: 'Environment', icon: '🏞️' },
  { id: 'scene', name: 'Scene', icon: '🎬' },
  { id: 'character', name: 'Character', icon: '👤' },
  { id: 'role', name: 'Role', icon: '🎭' },
  { id: 'hair', name: 'Hair', icon: '💇' },
  { id: 'eyes', name: 'Eyes', icon: '👁️' },
  { id: 'breasts', name: 'Breasts', icon: '🫧' },
  { id: 'clothes', name: 'Clothes', icon: '👗' },
  { id: 'shoes', name: 'Shoes', icon: '👠' },
  { id: 'accessories', name: 'Accessories', icon: '💍' },
  { id: 'expression', name: 'Expression', icon: '😊' },
  { id: '2d', name: '2D', icon: '🎌' },
  { id: 'basic-actions', name: 'Basic Actions', icon: '🏃' },
  { id: 'hand-actions', name: 'Hand Actions', icon: '👋' },
  { id: 'leg-actions', name: 'Leg Actions', icon: '🦵' },
  { id: 'compound-actions', name: 'Compound Actions', icon: '🤸' },
  { id: 'negative', name: 'Negative', icon: '❌' },
] as const

export const API_PROVIDERS = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    baseUrl: 'https://api.openai.com/v1',
    models: {
      text: ['gpt-4', 'gpt-3.5-turbo'],
      image: ['dall-e-3', 'dall-e-2']
    }
  },
  { 
    id: 'siliconflow', 
    name: '硅基流动', 
    baseUrl: 'https://api.siliconflow.cn/v1',
    models: {
      text: ['deepseek-ai/DeepSeek-V2', 'Qwen/Qwen2-7B-Instruct'],
      image: ['stabilityai/stable-diffusion-xl-base-1.0']
    }
  },
  { 
    id: 'volcengine', 
    name: '火山方舟', 
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: {
      text: ['doubao-pro-4k', 'doubao-lite-4k'],
      image: ['doubao-seedream-4-0-250828']
    }
  },
  { 
    id: 'moonshot', 
    name: '月之暗面', 
    baseUrl: 'https://api.moonshot.cn/v1',
    models: {
      text: ['moonshot-v1-8k', 'moonshot-v1-32k'],
      image: []
    }
  },
] as const

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  GENERATE: '/generate',
  GALLERY: '/gallery',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const

export const LIMITS = {
  FREE_CREDITS_PER_DAY: 10,
  PRO_CREDITS_PER_DAY: 100,
  ENTERPRISE_CREDITS_PER_DAY: 1000,
  MAX_PROMPT_LENGTH: 2000,
  MAX_NEGATIVE_PROMPT_LENGTH: 1000,
  MAX_STYLE_TAGS: 50,
} as const