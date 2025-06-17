import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'
import { type UserSelected, type LoginBody, type RegisterBody, NotificationType, type LoginResponse, type StoredUserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  const storedUserInfo: StoredUserInfo = JSON.parse(localStorage.getItem('userInfo') ?? '{}') || {}
  const isLoggedInStored = storedUserInfo.token && storedUserInfo.user ? true : false 
  const currentUser = ref<UserSelected | null>(storedUserInfo ? storedUserInfo.user : null)
  const isLoading = ref(false)
  const isLoggedIn = ref(isLoggedInStored || false)
  const notificationValues = ref<{ [key: string]: string }>({ message: '', type: '' })

  const login = async ({ email, password }: LoginBody) => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      const { data, status } = await api.post('/auth/login', { email, password })
      const response: LoginResponse = data

      if (status !== 200 || !data.success) {
        notificationValues.value = {
          message: 'Login failed',
          type: NotificationType.Error
        }
        isLoggedIn.value = false
        currentUser.value = null
        return false
      }

      isLoggedIn.value = true
      currentUser.value = response.user
      const userInfo = { user: response.user, token: response.token }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

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
      const { status } = await api.post('/auth/register', { email, password, username })
      notificationValues.value = {
        message: 'Registration successful',
        type: NotificationType.Success
      }

      return { status, success: true }
    } catch (error: any) {
      notificationValues.value = {
        message: 'Registration failed',
        type: NotificationType.Error
      }
      return { status: error.response.status, success: false }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    notificationValues.value = { message: '', type: '' }

    try {
      localStorage.removeItem('userInfo')
      
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
    getUserInfo
  }
})