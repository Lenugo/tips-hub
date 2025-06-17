import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'
import { useUserStore } from './user'
import { type LikedResponse, type PaginatedResponse, type Tip, type TipResponse, type TipDeleteResponse, NotificationType  } from '@/types'

export const useTipsStore = defineStore('tips', () => {
  const tips = ref<Tip[]>([])
  const userTips = ref<Tip[]>([])
  const currentTip = ref<Tip | null>(null)
  const isLoading = ref(false)
  const notificationValues = ref<{ [key: string]: string }>({ message: '', type: '' })
  const categories = ref<string[]>(['career', 'relationships', 'health', 'finance', 'personal-growth', 'productivity', 'education'])
  const userStore = useUserStore()
  
  const clearTips = () => {
    tips.value = []
  }

  const handleErrorTipResponse = (status: number, success: boolean, action: string): boolean => {
    if (status !== 200 || (status === 200 && !success)) {
      notificationValues.value = {
        message: `Something went ${action} wrong`,
        type: NotificationType.Error
      }

      return true
    }
    return false
  }

  const getAllTips = async (category?: string, page: number = 1, limit: number = 10) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
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
      notificationValues.value = {
        message: 'Error getting the tips',
        type: NotificationType.Error
      }
      return { tips: [], pagination: null }
    } finally {
      isLoading.value = false
    }
  }

  const getUserTips = async () => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
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
      notificationValues.value = {
        message: 'Error loading your tips',
        type: NotificationType.Error
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getTipById = async (id: string) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
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
      notificationValues.value = {
        message: 'Error getting the tip',
        type: NotificationType.Error
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createTip = async (tipData: Pick<Tip, 'title' | 'content' | 'categories'>) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      await api.post('/advices', tipData)

      notificationValues.value = {
        message: 'Tip created successfully',
        type: NotificationType.Success
      }
      return true
    } catch { 
      notificationValues.value = {
        message: 'Error creating your tip',
        type: NotificationType.Error
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTip = async (id: string, tipData: Partial<Tip>) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
    try {
      const { data, status } = await api.patch(`/advices/${id}`, tipData)
      const response: TipResponse = data

      if (handleErrorTipResponse(status, response.success, 'updating')) {
        return
      }

      notificationValues.value = {
        message: 'Tip updated successfully',
        type: NotificationType.Success
      }
      return response.data as Tip
    } catch {
      notificationValues.value = {
        message: 'Error updating the tip',
        type: NotificationType.Error
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const deleteTip = async (id: string) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
    try {
      const { data, status } = await api.delete(`/advices/${id}`)
      const response: TipDeleteResponse = data
      
      if (handleErrorTipResponse(status, response.success, 'removing')) {
        return
      }

      notificationValues.value = {
        message: 'Tip removed successfully',
        type: NotificationType.Success
      }
      return response.data.message
    } catch {
      notificationValues.value = {
        message: 'Error removing the tip',
        type: NotificationType.Error
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  const likeTip = async (id: string) => {
    notificationValues.value = { message: '', type: '' }

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
      
      if (action === 'liked') {
        notificationValues.value = {
          message: 'Tip liked',
          type: 'success'   
        }
      } else {
        notificationValues.value = {
          message: 'Tip unliked',
          type:'info'
        }
      }

      return response.data
    } catch {
      notificationValues.value = {
        message: 'Error liking the tip',
        type: NotificationType.Error
      }
      return null
    }
  }

  return {
    tips,
    userTips,
    currentTip,
    isLoading,
    categories,
    notificationValues,
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