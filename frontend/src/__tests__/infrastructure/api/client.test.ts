import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import { useAuthStore } from '@infrastructure/api/auth.store'
import { apiClient } from '@infrastructure/api/client'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')
  const requestFns: Array<(config: unknown) => unknown> = []
  const responseFns: Array<{ fulfilled: (r: unknown) => unknown; rejected: (e: unknown) => unknown }> = []

  const instance = {
    interceptors: {
      request: {
        use: (fn: (config: unknown) => unknown) => { requestFns.push(fn) },
      },
      response: {
        use: (fulfilled: (r: unknown) => unknown, rejected: (e: unknown) => unknown) => {
          responseFns.push({ fulfilled, rejected })
        },
      },
    },
    defaults: { headers: { common: {} } },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    _testRequestFns: requestFns,
    _testResponseFns: responseFns,
  }

  return {
    ...actual,
    default: {
      ...actual.default,
      create: () => instance,
    },
  }
})

function getRequestInterceptor() {
  const client = apiClient as unknown as { _testRequestFns: Array<(c: unknown) => unknown> }
  return client._testRequestFns[0]!
}

function getResponseInterceptor() {
  const client = apiClient as unknown as {
    _testResponseFns: Array<{ fulfilled: (r: unknown) => unknown; rejected: (e: unknown) => unknown }>
  }
  return client._testResponseFns[0]!
}

describe('apiClient', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, credentials: null })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('request interceptor', () => {
    it('should attach Basic Auth header when credentials exist', () => {
      useAuthStore.getState().setCredentials({ username: 'admin', password: 'secret' })
      const config = { headers: {} as Record<string, string> }
      const result = getRequestInterceptor()(config) as typeof config
      const expected = btoa('admin:secret')
      expect(result.headers.Authorization).toBe(`Basic ${expected}`)
    })

    it('should not attach Authorization header when no credentials', () => {
      const config = { headers: {} as Record<string, string> }
      const result = getRequestInterceptor()(config) as typeof config
      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('response interceptor', () => {
    it('should call setAuthenticated(false) on 401 response', async () => {
      useAuthStore.getState().setCredentials({ username: 'u', password: 'p' })
      expect(useAuthStore.getState().isAuthenticated).toBe(true)

      const error = new Error('Unauthorized') as Error & { response?: { status: number }; isAxiosError: boolean }
      error.isAxiosError = true
      error.response = { status: 401 }
      Object.defineProperty(error, 'isAxiosError', { value: true })

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const interceptor = getResponseInterceptor()
      await expect(interceptor.rejected(error)).rejects.toBe(error)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('should not clear auth on non-401 errors', async () => {
      useAuthStore.getState().setCredentials({ username: 'u', password: 'p' })

      const error = new Error('Server Error') as Error & { response?: { status: number }; isAxiosError: boolean }
      error.isAxiosError = true
      error.response = { status: 500 }

      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const interceptor = getResponseInterceptor()
      await expect(interceptor.rejected(error)).rejects.toBe(error)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('should pass through successful responses', () => {
      const response = { data: 'ok', status: 200 }
      const interceptor = getResponseInterceptor()
      expect(interceptor.fulfilled(response)).toEqual(response)
    })
  })
})
