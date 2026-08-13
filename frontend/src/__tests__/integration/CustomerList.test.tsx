import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { CustomerList } from '@/components/customers/CustomerList'

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

describe('CustomerList Integration', () => {
  it('should fetch and display customers from the API', async () => {
    renderWithProviders(<CustomerList />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeDefined()
    })

    expect(screen.getByText('Jane Smith')).toBeDefined()
    expect(screen.getByText('john.doe@example.com')).toBeDefined()
    expect(screen.getByText('jane.smith@example.com')).toBeDefined()
  })

  it('should filter customers based on search input', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CustomerList />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeDefined()
    })

    const searchInput = screen.getByLabelText('Search customers')
    await user.type(searchInput, 'Jane')

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeDefined()
      expect(screen.queryByText('John Doe')).toBeNull()
    })
  })

  it('should display empty state when no customers match', async () => {
    server.use(
      http.get('/bank-api/customers/all', () => {
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

    renderWithProviders(<CustomerList />)

    await waitFor(() => {
      expect(screen.getByText('No customers found.')).toBeDefined()
    })
  })

  it('should handle server error gracefully', async () => {
    server.use(
      http.get('/bank-api/customers/all', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    renderWithProviders(<CustomerList />)

    await waitFor(() => {
      expect(screen.queryByText('John Doe')).toBeNull()
    })
  })
})
