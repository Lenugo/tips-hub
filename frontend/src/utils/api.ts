import type { StoredUserInfo } from '@/types'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const userInfo: StoredUserInfo = JSON.parse(localStorage.getItem('userInfo') ?? '{}') || {}

  config.headers['Authorization'] = `Bearer ${userInfo.token}`
  return config
})

export default api
