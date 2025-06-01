import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'
import { useUserStore } from './user'
import type { LikedResponse, PaginatedResponse, Tip, TipResponse, TipDeleteResponse  } from '@/types'

export const useTipsStore = defineStore('tips', () => {
  const tips = ref<Tip[]>([])
  const userTips = ref<Tip[]>([])
  const currentTip = ref<Tip | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const categories = ref<string[]>(['career', 'relationships', 'health', 'finance', 'personal-growth', 'productivity', 'education'])
  const userStore = useUserStore()
  
  const clearTips = () => {
    tips.value = []
  }

  const handleErrorTipResponse = (status: number, success: boolean, action: string): boolean => {
    if (status !== 200 || (status === 200 && !success)) {
      error.value = `Something went wrong ${action} your tip`
      return true
    }
    return false
  }

  const getAllTips = async (category?: string, page: number = 1, limit: number = 10) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Build URL with parameters
      let url = '/advices'
      const params = []
      
      if (category) {
        params.push(`categories=${encodeURIComponent(category)}`)
      }
      
      params.push(`page=${page}`)
      params.push(`limit=${limit}`)
      
      if (params.length > 0) {
        url = `${url}?${params.join('&')}`
      }
      
      const { data, status } = await api.get(url)
      let response: PaginatedResponse<Tip> = data

      if (handleErrorTipResponse(status, response.success, 'getting')) {
        tips.value = []
        return { tips: [], pagination: null }
      }
      
      if (!response.data || !response.data.length) {
        if (page === 1) {
          tips.value = []
        }
        return { tips: [], pagination: null }
      }
      
      let newTips: Tip[] = []
      newTips = response.data
      
      // If it's the first page, replace tips; otherwise, append
      if (page === 1) {
        tips.value = newTips
      } else {
        const existingIds = new Set(tips.value.map(tip => tip.id))
        const uniqueNewTips = newTips.filter(tip => !existingIds.has(tip.id))
        tips.value = [...tips.value, ...uniqueNewTips]
      }
      
      return {
        tips: newTips,
        pagination: response.pagination
      }
    } catch {
      error.value = 'Error getting the tips'
      return { tips: [], pagination: null }
    } finally {
      isLoading.value = false
    }
  }

  const getUserTips = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, status } = await api.get('/advices/user')
      let response: TipResponse = data

      if (handleErrorTipResponse(status, response.success, 'getting')) {
        userTips.value = []
        return
      }

      if (!Array.isArray(response.data) || !response.data.length) {
        userTips.value = []
        return
      }

      userTips.value = response.data as Tip[]
      return userTips.value
    } catch {
      error.value = 'Error loading your tips'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getTipById = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, status } = await api.get(`/advices/${id}`)
      const response: TipResponse = data
      
      if (handleErrorTipResponse(status, response.success, 'getting')) {
        currentTip.value = null
        return
      }
      
      currentTip.value = response.data as Tip
      return response.data as Tip
    } catch {
      error.value = 'Error getting the tip'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createTip = async (tipData: Pick<Tip, 'title' | 'content' | 'categories'>) => {
    isLoading.value = true
    error.value = null

    try {
      const { data, status } = await api.post('/advices', tipData)
      const response: TipResponse = data

      if (handleErrorTipResponse(status, response.success, 'creating')) {
        return
      }

      // await getUserTips()
      // return response.data
    } catch { 
      error.value = 'Error creating tip'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTip = async (id: string, tipData: Partial<Tip>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, status } = await api.patch(`/advices/${id}`, tipData)
      const response: TipResponse = data

      if (handleErrorTipResponse(status, response.success, 'updating')) {
        return
      }

      await getUserTips()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error updating the tip'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTip = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const { data, status } = await api.delete(`/advices/${id}`)
      const response: TipDeleteResponse = data
      
      if (handleErrorTipResponse(status, response.success, 'removing')) {
        return
      }

      await getUserTips()
      return 'advice deleted successfully'
    } catch (err: any) {
      error.value = 'Error removing the tip. Try again or later.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const likeTip = async (id: string) => {
    try {
      const { data, status } = await api.post(`/advices/likes/${id}`)
      let response: LikedResponse = data

      if (handleErrorTipResponse(status, response.success, 'liking')) {
        return
      }

      const action = response.action // 'liked' o 'unliked'
      const increment = action === 'liked' ? 1 : -1
      
      const userId = userStore.currentUser?.id
      
      if (!userId) return null
      
      const updateTipLikeStatus = (tip: Tip) => {
        if (!tip) return tip
        
        const likedBy = Array.isArray(tip.likedBy) ? [...tip.likedBy] : []
        
        if (action === 'liked') {
          if (!likedBy.includes(userId)) {
            likedBy.push(userId)
          }
        } else {
          const index = likedBy.indexOf(userId)
          if (index !== -1) {
            likedBy.splice(index, 1)
          }
        }
        
        return {
          ...tip,
          likes: (tip.likes || 0) + increment,
          likedBy: likedBy
        }
      }
      
      if (currentTip.value) {
        if (currentTip.value && currentTip.value.id === id) {
          currentTip.value = {
            ...currentTip.value,
            ...updateTipLikeStatus(currentTip.value)
          }
        } 
        else if (currentTip.value.id === id) {
          currentTip.value = updateTipLikeStatus(currentTip.value)
        }
      }
      
      const tipIndex = tips.value.findIndex(tip => tip.id === id)
      if (tipIndex !== -1) {
        const updatedTip = updateTipLikeStatus(tips.value[tipIndex])
        
        tips.value = [
          ...tips.value.slice(0, tipIndex),
          updatedTip,
          ...tips.value.slice(tipIndex + 1)
        ]
      }
      
      const userTipIndex = userTips.value.findIndex(tip => tip.id === id || tip.author?._id === id)
      if (userTipIndex !== -1) {
        const updatedUserTip = updateTipLikeStatus(userTips.value[userTipIndex])
        
        userTips.value = [
          ...userTips.value.slice(0, userTipIndex),
          updatedUserTip,
          ...userTips.value.slice(userTipIndex + 1)
        ]
      }
      
      return response.data
    } catch {
      error.value = 'Error updating like'
      return null
    }
  }

  return {
    tips,
    userTips,
    currentTip,
    isLoading,
    error,
    categories,
    getAllTips,
    getUserTips,
    getTipById,
    createTip,
    updateTip,
    deleteTip,
    likeTip,
    clearTips
  }
})