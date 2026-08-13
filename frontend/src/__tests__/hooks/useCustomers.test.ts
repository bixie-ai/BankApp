import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useCustomers, useCustomer, useCreateCustomer, useDeleteCustomer } from '@/hooks/useCustomers'

const mockGetAll = vi.fn()
const mockGetByCustomerNumber = vi.fn()
const mockCreate = vi.fn()
const mockDelete = vi.fn()

vi.mock('@infrastructure/api/services/customer.service', () => ({
  customerService: {
    getAll: (...args: unknown[]) => mockGetAll(...args),
    getByCustomerNumber: (...args: unknown[]) => mockGetByCustomerNumber(...args),
    create: (...args: unknown[]) => mockCreate(...args),
    update: vi.fn(),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

const mockPaginatedResponse = {
  content: [
    { firstName: 'John', lastName: 'Doe', customerNumber: 1001, status: 'ACTIVE', contactDetails: { emailId: 'john@test.com' }, customerAddress: null },
  ],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
  first: true,
  last: true,
}

const mockCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  customerNumber: 1001,
  status: 'ACTIVE',
  contactDetails: { emailId: 'john@test.com', homePhone: '555-1234' },
  customerAddress: { address1: '123 Main St' },
}

describe('useCustomers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch customers with default params', async () => {
    mockGetAll.mockResolvedValue(mockPaginatedResponse)

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetAll).toHaveBeenCalledWith({})
    expect(result.current.data?.content).toHaveLength(1)
    expect(result.current.data?.content[0]?.firstName).toBe('John')
  })

  it('should pass search params to the service', async () => {
    mockGetAll.mockResolvedValue(mockPaginatedResponse)

    const { result } = renderHook(() => useCustomers({ page: 1, size: 5, search: 'John' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetAll).toHaveBeenCalledWith({ page: 1, size: 5, search: 'John' })
  })

  it('should handle fetch error', async () => {
    mockGetAll.mockRejectedValue(new Error('Network failure'))

    const { result } = renderHook(() => useCustomers(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect((result.current.error as Error).message).toBe('Network failure')
  })
})

describe('useCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch a single customer by number', async () => {
    mockGetByCustomerNumber.mockResolvedValue(mockCustomer)

    const { result } = renderHook(() => useCustomer(1001), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetByCustomerNumber).toHaveBeenCalledWith(1001)
    expect(result.current.data?.firstName).toBe('John')
  })

  it('should not fetch when customerNumber is undefined', () => {
    const { result } = renderHook(() => useCustomer(undefined), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockGetByCustomerNumber).not.toHaveBeenCalled()
  })
})

describe('useCreateCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call create with correct payload', async () => {
    mockCreate.mockResolvedValue('Customer created')

    const { result } = renderHook(() => useCreateCustomer(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync({
        firstName: 'Alice',
        lastName: 'Wonder',
        contactDetails: { emailId: 'alice@test.com' },
      })
    })

    expect(mockCreate).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Wonder',
      contactDetails: { emailId: 'alice@test.com' },
    })
  })
})

describe('useDeleteCustomer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call delete with customer number', async () => {
    mockDelete.mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeleteCustomer(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync(1001)
    })

    expect(mockDelete).toHaveBeenCalledWith(1001)
  })
})
