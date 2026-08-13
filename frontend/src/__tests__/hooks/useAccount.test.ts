import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useAccount } from '@/hooks/useAccount'

const mockGetById = vi.fn()

vi.mock('@infrastructure/api/services/account.service', () => ({
  accountService: {
    getById: (...args: unknown[]) => mockGetById(...args),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockAccountResponse = {
  success: true,
  data: {
    id: 'acc-1',
    customerId: 'cust-1',
    accountNumber: '1234567890',
    type: 'CHECKING' as const,
    status: 'ACTIVE' as const,
    balance: 1500.0,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  message: 'OK',
  timestamp: '2024-01-01T00:00:00Z',
}

describe('useAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch account by id', async () => {
    mockGetById.mockResolvedValue(mockAccountResponse)

    const { result } = renderHook(() => useAccount('acc-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetById).toHaveBeenCalledWith('acc-1')
    expect(result.current.data).toEqual(mockAccountResponse)
  })

  it('should not fetch when accountId is undefined', () => {
    const { result } = renderHook(() => useAccount(undefined), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetById).not.toHaveBeenCalled()
  })

  it('should handle error state', async () => {
    mockGetById.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useAccount('acc-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect((result.current.error as Error).message).toBe('Network error')
  })
})
