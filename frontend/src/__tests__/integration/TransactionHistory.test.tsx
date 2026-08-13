import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { TransactionHistory } from '@/components/accounts/TransactionHistory'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('TransactionHistory Integration', () => {
  it('should fetch and display transactions from the API', async () => {
    renderWithProviders(<TransactionHistory accountId="acc-001" />)

    await waitFor(() => {
      expect(screen.getByText('Payroll deposit')).toBeDefined()
    })

    expect(screen.getByText('ATM withdrawal')).toBeDefined()
    expect(screen.getByText('Transfer to savings')).toBeDefined()
  })

  it('should display empty state when no transactions exist', async () => {
    server.use(
      http.get('/bank-api/accounts/:accountId/transactions', () => {
        return HttpResponse.json({
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 10,
          first: true,
          last: true,
        })
      }),
    )

    renderWithProviders(<TransactionHistory accountId="acc-001" />)

    await waitFor(() => {
      expect(screen.getByText('No transactions found for this period.')).toBeDefined()
    })
  })

  it('should display error state on server failure', async () => {
    server.use(
      http.get('/bank-api/accounts/:accountId/transactions', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    renderWithProviders(<TransactionHistory accountId="acc-001" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeDefined()
    })
  })

  it('should show total transaction count', async () => {
    renderWithProviders(<TransactionHistory accountId="acc-001" />)

    await waitFor(() => {
      expect(screen.getByText('3 total transactions')).toBeDefined()
    })
  })
})
