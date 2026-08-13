import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransactionHistory } from '@/components/accounts/TransactionHistory'

const mockUseTransactions = vi.fn()

vi.mock('@/hooks/useTransactions', () => ({
  useTransactions: (...args: unknown[]) => mockUseTransactions(...args),
}))

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

const mockTransactions = {
  content: [
    {
      id: 'tx-1',
      accountId: 'acc-1',
      type: 'DEPOSIT' as const,
      status: 'COMPLETED' as const,
      amount: 1000.0,
      currency: 'USD',
      description: 'Salary deposit',
      referenceNumber: 'REF-001',
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'tx-2',
      accountId: 'acc-1',
      type: 'WITHDRAWAL' as const,
      status: 'COMPLETED' as const,
      amount: 250.0,
      currency: 'USD',
      description: 'ATM withdrawal',
      referenceNumber: 'REF-002',
      createdAt: '2024-01-16T00:00:00Z',
    },
  ],
  totalElements: 2,
  totalPages: 1,
  number: 0,
  size: 10,
  first: true,
  last: true,
}

describe('TransactionHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should display loading skeletons while fetching', () => {
    mockUseTransactions.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    const { container } = render(<TransactionHistory accountId="acc-1" />, {
      wrapper: createWrapper(),
    })

    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should display empty state when no transactions', () => {
    mockUseTransactions.mockReturnValue({
      data: { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10, first: true, last: true },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<TransactionHistory accountId="acc-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('No transactions found for this period.')).toBeDefined()
  })

  it('should display transaction table with correct data', () => {
    mockUseTransactions.mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<TransactionHistory accountId="acc-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('Salary deposit')).toBeDefined()
    expect(screen.getByText('ATM withdrawal')).toBeDefined()
    expect(screen.getByText('2 total transactions')).toBeDefined()
  })

  it('should display error state with retry button', async () => {
    const mockRefetch = vi.fn()
    mockUseTransactions.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to load'),
      refetch: mockRefetch,
    })

    render(<TransactionHistory accountId="acc-1" />, { wrapper: createWrapper() })

    expect(screen.getByText('Failed to load')).toBeDefined()
    const retryButton = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryButton)
    expect(mockRefetch).toHaveBeenCalledOnce()
  })

  it('should disable Previous button on first page', () => {
    mockUseTransactions.mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<TransactionHistory accountId="acc-1" />, { wrapper: createWrapper() })

    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toHaveAttribute('disabled')
  })

  it('should disable Next button on last page', () => {
    mockUseTransactions.mockReturnValue({
      data: mockTransactions,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<TransactionHistory accountId="acc-1" />, { wrapper: createWrapper() })

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toHaveAttribute('disabled')
  })

  it('should enable Next button when not on last page', () => {
    mockUseTransactions.mockReturnValue({
      data: { ...mockTransactions, last: false, totalPages: 3 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    })

    render(<TransactionHistory accountId="acc-1" />, { wrapper: createWrapper() })

    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).not.toHaveAttribute('disabled')
  })
})
