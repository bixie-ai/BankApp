import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useCreateAccount } from '@/hooks/useCreateAccount'

const mockCreateForCustomer = vi.fn()

vi.mock('@infrastructure/api/services/account.service', () => ({
  accountService: {
    createForCustomer: (...args: unknown[]) => mockCreateForCustomer(...args),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockAccountResponse = {
  success: true,
  data: {
    id: 'acc-new',
    customerId: 'cust-1',
    accountNumber: '9876543210',
    type: 'SAVINGS' as const,
    status: 'ACTIVE' as const,
    balance: 0,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  message: 'Created',
  timestamp: '2024-01-01T00:00:00Z',
}

describe('useCreateAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call createForCustomer with correct params', async () => {
    mockCreateForCustomer.mockResolvedValue(mockAccountResponse)

    const { result } = renderHook(() => useCreateAccount(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.mutateAsync({
        customerNumber: 1000,
        type: 'SAVINGS',
        currency: 'USD',
      })
    })

    expect(mockCreateForCustomer).toHaveBeenCalledWith({
      customerNumber: 1000,
      type: 'SAVINGS',
      currency: 'USD',
    })
  })

  it('should report error state on failure', async () => {
    mockCreateForCustomer.mockRejectedValue(new Error('Creation failed'))

    const { result } = renderHook(() => useCreateAccount(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.mutateAsync({
          customerNumber: 1000,
          type: 'CHECKING',
        })
      } catch {
        // expected
      }
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
    expect(result.current.error).toBeInstanceOf(Error)
    expect((result.current.error as Error).message).toBe('Creation failed')
  })
})
