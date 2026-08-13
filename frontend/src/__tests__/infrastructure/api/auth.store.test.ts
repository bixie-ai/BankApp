import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '@infrastructure/api/auth.store'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, credentials: null })
    vi.spyOn(Storage.prototype, 'clear')
  })

  describe('initial state', () => {
    it('should start with isAuthenticated false', () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should start with credentials null', () => {
      const state = useAuthStore.getState()
      expect(state.credentials).toBeNull()
    })
  })

  describe('setCredentials', () => {
    it('should set credentials and mark as authenticated', () => {
      useAuthStore.getState().setCredentials({ username: 'user1', password: 'pass1' })
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.credentials).toEqual({ username: 'user1', password: 'pass1' })
    })
  })

  describe('setAuthenticated', () => {
    it('should set isAuthenticated to true', () => {
      useAuthStore.getState().setAuthenticated(true)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('should clear credentials and localStorage when set to false', () => {
      useAuthStore.getState().setCredentials({ username: 'u', password: 'p' })
      useAuthStore.getState().setAuthenticated(false)
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.credentials).toBeNull()
      expect(localStorage.clear).toHaveBeenCalled()
    })
  })

  describe('logout', () => {
    it('should clear credentials, set isAuthenticated false, and clear localStorage', () => {
      useAuthStore.getState().setCredentials({ username: 'u', password: 'p' })
      useAuthStore.getState().logout()
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
      expect(state.credentials).toBeNull()
      expect(localStorage.clear).toHaveBeenCalled()
    })
  })
})
