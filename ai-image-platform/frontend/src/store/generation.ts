import { create } from 'zustand'
import type { GenerationRequest, StyleTag } from '@/types'

interface GenerationState {
  // Form state
  prompt: string
  negativePrompt: string
  selectedTags: StyleTag[]
  ratio: string
  quality: string
  apiConfigId: string
  isFopMode: boolean
  
  // UI state
  isGenerating: boolean
  progress: number
  currentStep: string
  
  // History
  recentPrompts: string[]
  
  // Actions
  setPrompt: (prompt: string) => void
  setNegativePrompt: (prompt: string) => void
  addTag: (tag: StyleTag) => void
  removeTag: (tagId: string) => void
  clearTags: () => void
  setRatio: (ratio: string) => void
  setQuality: (quality: string) => void
  setApiConfigId: (id: string) => void
  setFopMode: (enabled: boolean) => void
  setGenerating: (generating: boolean) => void
  setProgress: (progress: number) => void
  setCurrentStep: (step: string) => void
  addRecentPrompt: (prompt: string) => void
  reset: () => void
}

const initialState = {
  prompt: '',
  negativePrompt: '',
  selectedTags: [],
  ratio: '1:1',
  quality: 'normal',
  apiConfigId: '',
  isFopMode: false,
  isGenerating: false,
  progress: 0,
  currentStep: '',
  recentPrompts: [],
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  ...initialState,

  setPrompt: (prompt: string) => {
    set({ prompt })
  },

  setNegativePrompt: (negativePrompt: string) => {
    set({ negativePrompt })
  },

  addTag: (tag: StyleTag) => {
    const { selectedTags } = get()
    const exists = selectedTags.find(t => t.id === tag.id)
    if (!exists) {
      set({ selectedTags: [...selectedTags, tag] })
    }
  },

  removeTag: (tagId: string) => {
    const { selectedTags } = get()
    set({ selectedTags: selectedTags.filter(t => t.id !== tagId) })
  },

  clearTags: () => {
    set({ selectedTags: [] })
  },

  setRatio: (ratio: string) => {
    set({ ratio })
  },

  setQuality: (quality: string) => {
    set({ quality })
  },

  setApiConfigId: (apiConfigId: string) => {
    set({ apiConfigId })
  },

  setFopMode: (isFopMode: boolean) => {
    set({ isFopMode })
  },

  setGenerating: (isGenerating: boolean) => {
    set({ isGenerating })
  },

  setProgress: (progress: number) => {
    set({ progress })
  },

  setCurrentStep: (currentStep: string) => {
    set({ currentStep })
  },

  addRecentPrompt: (prompt: string) => {
    const { recentPrompts } = get()
    const filtered = recentPrompts.filter(p => p !== prompt)
    set({ recentPrompts: [prompt, ...filtered].slice(0, 10) })
  },

  reset: () => {
    set(initialState)
  },
}))