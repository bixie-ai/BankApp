import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useTransactions } from '@/hooks/useTransactions'

const mockGetTransactions = vi.fn()

vi.mock('@infrastructure/api/services/account.service', () => ({
  accountService: {
    getTransactions: (...args: unknown[]) => mockGetTransactions(...args),
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

const mockTransactionPage = {
  content: [
    {
      id: 'tx-1',
      accountId: 'acc-1',
      type: 'DEPOSIT' as const,
      status: 'COMPLETED' as const,
      amount: 500.0,
      currency: 'USD',
      description: 'Direct deposit',
      referenceNumber: 'REF-001',
      createdAt: '2024-01-15T00:00:00Z',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
  first: true,
  last: true,
}

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch transactions with default pagination', async () => {
    mockGetTransactions.mockResolvedValue(mockTransactionPage)

    const { result } = renderHook(
      () => useTransactions({ accountId: 'acc-1' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetTransactions).toHaveBeenCalledWith('acc-1', { page: 0, size: 10 })
    expect(result.current.data).toEqual(mockTransactionPage)
  })

  it('should pass custom page and size params', async () => {
    mockGetTransactions.mockResolvedValue(mockTransactionPage)

    const { result } = renderHook(
      () => useTransactions({ accountId: 'acc-1', page: 2, size: 20 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetTransactions).toHaveBeenCalledWith('acc-1', { page: 2, size: 20 })
  })

  it('should not fetch when accountId is empty string', () => {
    const { result } = renderHook(
      () => useTransactions({ accountId: '' }),
      { wrapper: createWrapper() },
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetTransactions).not.toHaveBeenCalled()
  })

  it('should handle error state', async () => {
    mockGetTransactions.mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(
      () => useTransactions({ accountId: 'acc-1' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
  })
})
