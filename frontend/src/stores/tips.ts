import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'
import { useUserStore } from './user'

export interface Tip {
  id: string
  title: string
  content: string
  categories?: string | string[]
  userId: string
  userName?: string
  likes?: number
  createdAt: string
  updatedAt: string
}

export interface ITipResponse {
  success: boolean
  data: Tip
}

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
      
      const response = await api.get(url)
      
      if (!response.data || typeof response.data !== 'object') {
        if (page === 1) {
          tips.value = []
        }
        return { tips: [], pagination: null }
      }
      
      // Extract tips from response
      let newTips: Tip[] = []
      if (Array.isArray(response.data.data)) {
        newTips = response.data.data
      } else {
        const responseData = Object.values(response.data).filter(Array.isArray)
        if (responseData.length > 0) {
          newTips = responseData[0] as Tip[]
        }
      }
      
      // If it's the first page, replace tips; otherwise, append
      if (page === 1) {
        tips.value = newTips
      } else {
        // Avoid duplicates by checking IDs
        const existingIds = new Set(tips.value.map(tip => tip.id))
        const uniqueNewTips = newTips.filter(tip => !existingIds.has(tip.id))
        tips.value = [...tips.value, ...uniqueNewTips]
      }
      
      return {
        tips: newTips,
        pagination: response.data.pagination
      }
    } catch (err: any) {
      console.error(err)
      error.value = err.response?.data?.message || 'Error getting the tips'
      return { tips: [], pagination: null }
    } finally {
      isLoading.value = false
    }
  }

  const getUserTips = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/advices/user')
      // Verificar que response.data sea un array
      if (Array.isArray(response.data)) {
        userTips.value = response.data
      } else if (response.data && typeof response.data === 'object') {
        // Si es un objeto, podría tener una propiedad que contiene el array
        const possibleArrays = Object.values(response.data).filter(Array.isArray)
        if (possibleArrays.length > 0) {
          userTips.value = possibleArrays[0] as Tip[]
        } else {
          // Si no hay arrays, podría ser un solo objeto
          userTips.value = [response.data] as Tip[]
        }
      } else {
        // Si no es ni array ni objeto, inicializar como array vacío
        userTips.value = []
        console.error('Formato de respuesta inesperado:', response.data)
      }
      return userTips.value
    } catch (err: any) {
      console.error('Error al obtener los tips del usuario:', err)
      error.value = err.response?.data?.message || 'Error al cargar tus tips'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const getTipById = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/advices/${id}`)
      currentTip.value = response.data
      return response.data
    } catch (err: any) {
      console.error(`Error al obtener el tip ${id}:`, err)
      error.value = err.response?.data?.message || 'Error al cargar el tip'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const createTip = async (tipData: Omit<Tip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/advices', tipData)
      await getUserTips()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error creating the tip'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const updateTip = async (id: string, tipData: Partial<Tip>) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.patch(`/advices/${id}`, tipData)
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
      const response = await api.delete(`/advices/${id}`)
      await getUserTips()
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error deleting the tip'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const likeTip = async (id: string) => {
    try {
      const response = await api.post(`/advices/likes/${id}`)
      const { action } = response.data // 'liked' o 'unliked'
      const increment = action === 'liked' ? 1 : -1
      
      const userId = userStore.currentUser?.id
      
      if (!userId) return null
      
      const updateTipLikeStatus = (tip: any) => {
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
        if (currentTip.value.data && currentTip.value.data.id === id) {
          currentTip.value = {
            ...currentTip.value,
            data: updateTipLikeStatus(currentTip.value.data)
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
      
      const userTipIndex = userTips.value.findIndex(tip => tip.id === id || tip._id === id)
      if (userTipIndex !== -1) {
        const updatedUserTip = updateTipLikeStatus(userTips.value[userTipIndex])
        
        userTips.value = [
          ...userTips.value.slice(0, userTipIndex),
          updatedUserTip,
          ...userTips.value.slice(userTipIndex + 1)
        ]
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Error al actualizar like'
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