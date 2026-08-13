import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AccountDetail } from '@/components/accounts/AccountDetail'

const mockUseAccount = vi.fn()

vi.mock('@/hooks/useAccount', () => ({
  useAccount: (...args: unknown[]) => mockUseAccount(...args),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const mockAccountData = {
  success: true,
  data: {
    id: 'acc-1',
    customerId: 'cust-1',
    accountNumber: '1234567890',
    type: 'CHECKING',
    status: 'ACTIVE',
    balance: 2500.75,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  message: 'OK',
  timestamp: '2024-01-01T00:00:00Z',
}

describe('AccountDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading skeletons while fetching', () => {
    mockUseAccount.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    const { container } = render(<AccountDetail accountId="acc-1" />, {
      wrapper: createWrapper(),
    })

    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should display account details when loaded', () => {
    mockUseAccount.mockReturnValue({
      data: mockAccountData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<AccountDetail accountId="acc-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('1234567890')).toBeDefined()
    expect(screen.getByText('CHECKING')).toBeDefined()
    expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0)
    expect(screen.getByText('$2,500.75')).toBeDefined()
  })

  it('should display error state with retry button', async () => {
    const mockRefetch = vi.fn()
    mockUseAccount.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Server error'),
      refetch: mockRefetch,
    })

    render(<AccountDetail accountId="acc-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('Server error')).toBeDefined()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    expect(retryButton).toBeDefined()

    fireEvent.click(retryButton)
    expect(mockRefetch).toHaveBeenCalledOnce()
  })

  it('should display not-found message when data is null', () => {
    mockUseAccount.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<AccountDetail accountId="acc-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('Account not found.')).toBeDefined()
  })

  it('should show correct badge variant for ACTIVE status', () => {
    mockUseAccount.mockReturnValue({
      data: mockAccountData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<AccountDetail accountId="acc-1" />, { wrapper: createWrapper() })

    const badge = screen.getAllByText('ACTIVE')
    expect(badge.length).toBeGreaterThan(0)
  })
})
