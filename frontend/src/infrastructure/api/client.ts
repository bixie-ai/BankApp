import axios from 'axios'
import { useAuthStore } from './auth.store'

/**
 * Pre-configured Axios HTTP client for communicating with the backend API.
 *
 * Uses the base URL from the VITE_API_BASE_URL environment variable.
 * Automatically attaches Basic Auth credentials from the auth store on every
 * outgoing request and resets authentication state on 401 responses.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Request interceptor that injects Basic Auth credentials when available. */
apiClient.interceptors.request.use((config) => {
  const { credentials } = useAuthStore.getState()
  if (credentials) {
    const encoded = btoa(`${credentials.username}:${credentials.password}`)
    config.headers.Authorization = `Basic ${encoded}`
  }
  return config
})

/**
 * Response interceptor that handles authentication failures globally.
 * On a 401 response the user is automatically de-authenticated, which
 * triggers a redirect to the login screen via the auth store subscription.
 */
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
