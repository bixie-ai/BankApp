import { create } from 'zustand'

/** Username/password pair used for Basic Auth against the backend API. */
interface Credentials {
  username: string
  password: string
}

/**
 * Shape of the authentication store managed by Zustand.
 * Holds current auth status and credentials, plus actions to mutate them.
 */
interface AuthState {
  isAuthenticated: boolean
  credentials: Credentials | null
  setAuthenticated: (authenticated: boolean) => void
  setCredentials: (credentials: Credentials) => void
  logout: () => void
}

/**
 * Global authentication store powered by Zustand.
 *
 * Manages the user's authentication lifecycle including credential storage
 * (in-memory only) and session teardown. When authentication is revoked
 * (either by calling `logout` or receiving a 401 via the API client),
 * localStorage is cleared to remove any persisted UI state.
 */
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
