import { create } from 'zustand'

interface Credentials {
  username: string
  password: string
}

interface AuthState {
  isAuthenticated: boolean
  credentials: Credentials | null
  setAuthenticated: (authenticated: boolean) => void
  setCredentials: (credentials: Credentials) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  credentials: null,
  setAuthenticated: (authenticated: boolean) => {
    if (!authenticated) {
      localStorage.clear()
      set({ isAuthenticated: false, credentials: null })
    } else {
      set({ isAuthenticated: authenticated })
    }
  },
  setCredentials: (credentials: Credentials) => {
    set({ isAuthenticated: true, credentials })
  },
  logout: () => {
    localStorage.clear()
    set({ isAuthenticated: false, credentials: null })
  },
}))
