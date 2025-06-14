import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL ?? ''

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.defaults.withCredentials = true

export default api
