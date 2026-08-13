import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { CreateAccountForm } from '@/components/accounts/CreateAccountForm'

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

describe('CreateAccountForm Integration', () => {
  it('should successfully create an account via API', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()

    renderWithProviders(<CreateAccountForm onSuccess={onSuccess} />)

    const customerInput = screen.getByLabelText(/customer number/i)
    await user.type(customerInput, '1001')

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('should display validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<CreateAccountForm />)

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Customer number is required')).toBeDefined()
    })
  })

  it('should handle server error during account creation', async () => {
    server.use(
      http.post('/bank-api/accounts/add/:customerNumber', () => {
        return new HttpResponse(null, { status: 500 })
      }),
    )

    const user = userEvent.setup()
    renderWithProviders(<CreateAccountForm />)

    const customerInput = screen.getByLabelText(/customer number/i)
    await user.type(customerInput, '1001')

    const submitButton = screen.getByRole('button', { name: /create account/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).not.toBeDisabled()
    })
  })
})
