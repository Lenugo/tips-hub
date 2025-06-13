import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'
import { type UserSelected, type LoginBody, type RegisterBody, NotificationType } from '@/types'
import type { AxiosError } from 'axios'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<UserSelected | null>(null)
  const isLoading = ref(false)
  const isLoggedIn = ref(false)
  const notificationValues = ref<{ [key: string]: string }>({ message: '', type: '' })
  
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
    } catch {
      currentUser.value = null
      isLoggedIn.value = false
      return false
    } finally {
      isLoading.value = false
    }
  }
  
  const login = async ({ email, password }: LoginBody) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      await api.post('/auth/login', { email, password })
      notificationValues.value = {
        message: 'Login successful',
        type: NotificationType.Success
      }
      return true
    } catch (error: any) {
      notificationValues.value = {
        message: !!(error.response?.data?.message) ? `Login Failed. ${error.response.data.message}` :'Login failed',
        type: NotificationType.Error
      } 
      isLoggedIn.value = false
      currentUser.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async ({ email, password, username }: RegisterBody) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      await api.post('/auth/register', { email, password, username })
      notificationValues.value = {
        message: 'Registration successful',
        type: NotificationType.Success
      }

      return true
    } catch {
      notificationValues.value = {
        message: 'Registration failed',
        type: NotificationType.Error
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      await api.post('/auth/logout')
      
      notificationValues.value = {
        message: 'Logout successful',
        type: NotificationType.Success
      }

      currentUser.value = null
      isLoggedIn.value = false
      return true
    } catch {
      notificationValues.value = {
        message: 'Logout failed',
        type: NotificationType.Error
      }
      isLoggedIn.value = true // Set to true to allow user to try logging out again if needed
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getUserInfo = async () => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      const response = await api.get('/auth/profile')
      isLoggedIn.value = true      

      return response.data.user
    } catch {
      notificationValues.value = {
        message: 'Error getting user info',
        type: NotificationType.Error
      }
      isLoggedIn.value = false
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentUser,
    isLoggedIn,
    isLoading,
    notificationValues,
    login,
    register,
    logout,
    checkAuth,
    getUserInfo
  }
})