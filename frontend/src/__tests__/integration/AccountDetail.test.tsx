import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { AccountDetail } from '@/components/accounts/AccountDetail'

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

describe('AccountDetail Integration', () => {
  it('should fetch and display account details from the API', async () => {
    renderWithProviders(<AccountDetail accountId="acc-001" />)

    await waitFor(() => {
      expect(screen.getByText('9876543210')).toBeDefined()
    })

    expect(screen.getByText('CHECKING')).toBeDefined()
    expect(screen.getByText('$5,250.75')).toBeDefined()
  })

  it('should display error state for non-existent account', async () => {
    server.use(
      http.get('/bank-api/accounts/:accountId', () => {
        return new HttpResponse(null, { status: 404 })
      }),
    )

    renderWithProviders(<AccountDetail accountId="acc-nonexistent" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeDefined()
    })
  })

  it('should display error message on server failure', async () => {
    server.use(
      http.get('/bank-api/accounts/:accountId', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    renderWithProviders(<AccountDetail accountId="acc-001" />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeDefined()
    })
  })
})
