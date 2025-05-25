import { defineStore } from 'pinia'
import { ref } from 'vue'
// import type { User } from '../types'
import api from '../utils/api'

type LoginData = {
  email: string,
  password: string
}

type RegisterData = {
  email: string,
  password: string,
  username: string
}

interface User {
  id: string
  userName: string
  email: string
  createdAt: string
  updatedAt: string
  likedTips?: string[] 
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isLoggedIn = ref(false)
  
  // Check authentication status with the server
  const checkAuth = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/auth/check')
      if (response.data.authenticated) {
        currentUser.value = response.data.user
        isLoggedIn.value = true
        return true
      } else {
        currentUser.value = null
        isLoggedIn.value = false
        return false
      }
    } catch (error) {
      currentUser.value = null
      isLoggedIn.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const login = async ({ email, password }: LoginData) => {
    isLoading.value = true
    error.value = null
    try {
      await api.post('/auth/login', { email, password })
      return await checkAuth()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      isLoggedIn.value = false
      currentUser.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async ({ email, password, username }: RegisterData) => {
    isLoading.value = true
    error.value = null
    try {
      await api.post('/auth/register', { email, password, username })
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      isLoggedIn.value = false
      currentUser.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    isLoading.value = true
    try {
      await api.post('/auth/logout')
      currentUser.value = null
      isLoggedIn.value = false
      return true
    } catch (error) {
      console.error('Logout failed:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getUserInfo = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/auth/profile')
      isLoggedIn.value = true
      return response.data.user
    } catch (error) {
      console.error('Get user failed:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }

const hasLikedTip = (tipId: string, likedByArray?: string[]) => {
  if (!currentUser.value) {
    return false
  }
  
  if (likedByArray) {
    return likedByArray.includes(currentUser.value.id)
  } else if (currentUser.value.likedTips) {
    return currentUser.value.likedTips.includes(tipId)
  }
  
  return false
}

  // Initialize user by checking auth status
  const initUser = async () => {
    return await checkAuth()
  }

  return {
    currentUser,
    isLoggedIn,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
    hasLikedTip,
    getUserInfo,
    initUser
  }
})