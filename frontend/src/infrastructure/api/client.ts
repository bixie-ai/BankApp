import axios from 'axios'
import { useAuthStore } from './auth.store'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const { credentials } = useAuthStore.getState()
  if (credentials) {
    const encoded = btoa(`${credentials.username}:${credentials.password}`)
    config.headers.Authorization = `Basic ${encoded}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().setAuthenticated(false)
    }
    return Promise.reject(error)
  },
)

export { apiClient }
