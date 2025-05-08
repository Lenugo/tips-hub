import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tip, ApiResponse } from '../types'
import tipsData from '../data/tips.json'

export const useTipsStore = defineStore('tips', () => {
  const tips = ref<Tip[]>([])
  const selectedCategory = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Initialize with mock data
  const initializeTips = () => {
    const response = tipsData as ApiResponse<Tip[]>
    if (response.success) {
      tips.value = response.data
    }
  }

  // Computed: Filtered tips based on selected category
  const filteredTips = computed(() => {
    if (!selectedCategory.value) return tips.value
    return tips.value.filter(tip => 
      tip.category.includes(selectedCategory.value as string)
    )
  })

  // Get all unique categories
  const categories = computed(() => {
    const categorySet = new Set<string>()
    tips.value.forEach(tip => {
      tip.category.forEach(cat => categorySet.add(cat))
    })
    return Array.from(categorySet)
  })

  // Get a single tip by ID
  const getTipById = (id: string) => {
    return tips.value.find(tip => tip.id === id)
  }

  // Like a tip
  const likeTip = (tipId: string, userId: string) => {
    const tip = tips.value.find(t => t.id === tipId)
    if (tip) {
      // Check if user already liked this tip
      const alreadyLiked = tip.likedBy.includes(userId)
      
      if (alreadyLiked) {
        // Unlike
        tip.likes--
        tip.likedBy = tip.likedBy.filter(id => id !== userId)
      } else {
        // Like
        tip.likes++
        tip.likedBy.push(userId)
      }
    }
  }

  // Set selected category
  const setCategory = (category: string | null) => {
    selectedCategory.value = category
  }

  // Add a new tip
  const addTip = (tip: Omit<Tip, 'id' | 'createdAt' | 'publishedDate' | 'likes' | 'likedBy'>) => {
    const newTip: Tip = {
      id: Math.random().toString(36).substring(2, 15),
      publishedDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      ...tip
    }
    
    tips.value.unshift(newTip)
    return newTip
  }

  // Update existing tip
  const updateTip = (id: string, updatedData: Partial<Tip>) => {
    const index = tips.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tips.value[index] = { ...tips.value[index], ...updatedData }
      return tips.value[index]
    }
    return null
  }

  // Remove a tip
  const removeTip = (id: string) => {
    tips.value = tips.value.filter(tip => tip.id !== id)
  }

  return {
    tips,
    isLoading,
    error,
    filteredTips,
    categories,
    selectedCategory,
    initializeTips,
    getTipById,
    likeTip,
    setCategory,
    addTip,
    updateTip,
    removeTip
  }
})