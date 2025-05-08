import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  const isLoggedIn = computed(() => !!currentUser.value)
  
  // Mock user data for demo
  const mockUser: User = {
    _id: '6819760709e0b7197558d836',
    username: 'Testing',
    email: 'test3@mails.com'
  }

  // Login user
  const login = () => {
    // In a real app, this would make an API call
    currentUser.value = mockUser
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  // Logout user
  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user')
  }

  // Check if user has already liked a tip
  const hasLikedTip = (tipLikedBy: string[]) => {
    if (!currentUser.value) return false
    return tipLikedBy.includes(currentUser.value._id)
  }

  // Initialize user from localStorage if available
  const initUser = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      currentUser.value = JSON.parse(storedUser)
    }
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    logout,
    hasLikedTip,
    initUser
  }
})