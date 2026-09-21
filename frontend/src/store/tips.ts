import { defineStore } from 'pinia'
import { ref } from 'vue'
import api, { getApiErrorCode } from '../utils/api'
import { FeedCache } from '../utils/feedCache'
import { useUserStore } from './user'
import { type LikedResponse, type PaginatedResponse, type Tip, type TipResponse, type TipDeleteResponse, NotificationType  } from '@/types'

const LIST_TTL_MS = 60_000

interface CachedList {
  tips: Tip[]
  pagination: PaginatedResponse<Tip>['pagination']
}

const listCache = new FeedCache<CachedList>(LIST_TTL_MS)
const detailCache = new FeedCache<Tip>(LIST_TTL_MS)
const myTipsCache = new FeedCache<Tip[]>(LIST_TTL_MS)

const listKey = (category?: string, page: number = 1, limit: number = 10) =>
  `${category ?? 'all'}:${page}:${limit}`

export const useTipsStore = defineStore('tips', () => {
  const tips = ref<Tip[]>([])
  const userTips = ref<Tip[]>([])
  const currentTip = ref<Tip | null>(null)
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)
  const hasLoadedOnce = ref(false)
  const listPagination = ref<PaginatedResponse<Tip>['pagination'] | null>(null)
  const notificationValues = ref<{ [key: string]: string }>({ message: '', type: '' })
  const categories = ref<string[]>(['career', 'relationships', 'health', 'finance', 'personal-growth', 'productivity', 'education'])
  const userStore = useUserStore()
  let lastListQuery: { category?: string; page: number; limit: number } = { page: 1, limit: 10 }
  
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

  const applyListResult = (result: CachedList, page: number) => {
    if (page === 1) {
      tips.value = result.tips
    } else {
      const existingIds = new Set(tips.value.map(tip => tip.id))
      const uniqueNewTips = result.tips.filter(tip => !existingIds.has(tip.id))
      tips.value = [...tips.value, ...uniqueNewTips]
    }
    listPagination.value = result.pagination
    loadError.value = null
  }

  const getAllTips = async (category?: string, page: number = 1, limit: number = 10, force: boolean = false) => {
    const key = listKey(category, page, limit)
    lastListQuery = { category, page, limit }

    if (!force) {
      const cached = listCache.get(key)
      if (cached) {
        applyListResult(cached, page)
        if (page === 1) hasLoadedOnce.value = true
        return { tips: cached.tips, pagination: cached.pagination }
      }
    }

    isLoading.value = true
    loadError.value = null
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
        const stale = listCache.getStale(key)
        if (stale) {
          applyListResult(stale, page)
          return { tips: stale.tips, pagination: stale.pagination }
        }
        tips.value = []
        loadError.value = 'UNKNOWN'
        listPagination.value = null
        return { tips: [], pagination: null }
      }
      
      if (!response.data || !response.data.length) {
        listCache.set(key, { tips: [], pagination: response.pagination ?? null })
        if (page === 1) {
          tips.value = []
        }
        listPagination.value = response.pagination ?? null
        return { tips: [], pagination: listPagination.value }
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
      
      listPagination.value = response.pagination
      listCache.set(key, { tips: newTips, pagination: response.pagination })
      return {
        tips: newTips,
        pagination: response.pagination
      }
    } catch (error) {
      const stale = listCache.getStale(key)
      if (stale) {
        applyListResult(stale, page)
        return { tips: stale.tips, pagination: stale.pagination }
      }
      loadError.value = getApiErrorCode(error)
      listPagination.value = null
      notificationValues.value = {
        message: 'Error getting the tips',
        type: NotificationType.Error
      }
      return { tips: [], pagination: null }
    } finally {
      isLoading.value = false
      hasLoadedOnce.value = true
    }
  }

  const getUserTips = async () => {
    const cached = myTipsCache.get('mine')
    if (cached) {
      userTips.value = cached
      return userTips.value
    }

    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
    try {
      const { data, status } = await api.get('/advices/user')
      let response: TipResponse = data

      if (handleErrorTipResponse(status, response.success, 'getting')) {
        const stale = myTipsCache.getStale('mine')
        if (stale) {
          userTips.value = stale
          return userTips.value
        }
        userTips.value = []
        return
      }

      if (!Array.isArray(response.data) || !response.data.length) {
        userTips.value = []
        myTipsCache.set('mine', [])
        return
      }

      userTips.value = response.data as Tip[]
      myTipsCache.set('mine', userTips.value)
      return userTips.value
    } catch {
      const stale = myTipsCache.getStale('mine')
      if (stale) {
        userTips.value = stale
        return userTips.value
      }
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
    const cached = detailCache.get(id)
    if (cached) {
      currentTip.value = cached
      return cached
    }

    isLoading.value = true
    notificationValues.value = { message: '', type: '' }
    
    try {
      const { data, status } = await api.get(`/advices/${id}`)
      const response: TipResponse = data
      
      if (handleErrorTipResponse(status, response.success, 'getting')) {
        const stale = detailCache.getStale(id)
        if (stale) {
          currentTip.value = stale
          return stale
        }
        currentTip.value = null
        return
      }
      
      currentTip.value = response.data as Tip
      detailCache.set(id, currentTip.value)
      return currentTip.value
    } catch {
      const stale = detailCache.getStale(id)
      if (stale) {
        currentTip.value = stale
        return stale
      }
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

      listCache.clear()
      myTipsCache.delete('mine')

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

      listCache.clear()
      detailCache.delete(id)
      myTipsCache.delete('mine')

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

      listCache.clear()
      detailCache.delete(id)
      myTipsCache.delete('mine')

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

      detailCache.updateAll(tip => (tip.id === id ? updateTipLikeStatus(tip) : tip))
      listCache.updateAll(entry => {
        if (!entry.tips.some(tip => tip.id === id)) return entry
        return {
          ...entry,
          tips: entry.tips.map(tip => (tip.id === id ? updateTipLikeStatus(tip) : tip))
        }
      })
      myTipsCache.updateAll(list => {
        if (!list.some(tip => tip.id === id || tip.author?._id === id)) return list
        return list.map(tip => (tip.id === id || tip.author?._id === id ? updateTipLikeStatus(tip) : tip))
      })
      
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
    loadError,
    hasLoadedOnce,
    listPagination,
    categories,
    notificationValues,
    getAllTips,
    retryList: () => getAllTips(lastListQuery.category, lastListQuery.page, lastListQuery.limit, true),
    getUserTips,
    getTipById,
    createTip,
    updateTip,
    deleteTip,
    likeTip,
    clearTips
  }
})