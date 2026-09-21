import type { StoredUserInfo } from '@/types'
import axios, { type AxiosError } from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export const API_TIMEOUT_MS = 12_000

export const ApiErrorCode = {
  TIMEOUT: 'TIMEOUT',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN'
} as const

export type ApiErrorCodeValue = (typeof ApiErrorCode)[keyof typeof ApiErrorCode]

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const userInfo: StoredUserInfo = JSON.parse(localStorage.getItem('userInfo') ?? '{}') || {}

  config.headers['Authorization'] = `Bearer ${userInfo.token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        error.code = ApiErrorCode.TIMEOUT
      } else if (!error.response) {
        error.code = ApiErrorCode.NETWORK
      }
    }

    return Promise.reject(error)
  }
)

export const getApiErrorCode = (error: unknown): ApiErrorCodeValue => {
  if (axios.isAxiosError(error)) {
    if (error.code === ApiErrorCode.TIMEOUT || error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return ApiErrorCode.TIMEOUT
    }
    if (error.code === ApiErrorCode.NETWORK || !error.response) {
      return ApiErrorCode.NETWORK
    }
  }

  return ApiErrorCode.UNKNOWN
}

export default api
