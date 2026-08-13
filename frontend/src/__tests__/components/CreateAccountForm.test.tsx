import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateAccountForm } from '@/components/accounts/CreateAccountForm'

const mockMutateAsync = vi.fn()
const mockUseCreateAccount = vi.fn()

vi.mock('@/hooks/useCreateAccount', () => ({
  useCreateAccount: () => mockUseCreateAccount(),
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

import toast from 'react-hot-toast'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('CreateAccountForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCreateAccount.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    })
  })

  it('should render all form fields', () => {
    render(<CreateAccountForm />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/customer number/i)).toBeDefined()
    expect(screen.getByLabelText(/account type/i)).toBeDefined()
    expect(screen.getByLabelText(/currency/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /create account/i })).toBeDefined()
  })

  it('should show validation error for empty customer number', async () => {
    render(<CreateAccountForm />, { wrapper: createWrapper() })

    const form = screen.getByRole('button', { name: /create account/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Customer number is required')).toBeDefined()
    })
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('should show validation error for non-numeric customer number', async () => {
    render(<CreateAccountForm />, { wrapper: createWrapper() })

    const input = screen.getByLabelText(/customer number/i)
    fireEvent.change(input, { target: { value: 'abc' } })

    const form = screen.getByRole('button', { name: /create account/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(screen.getByText('Must be a valid number')).toBeDefined()
    })
  })

  it('should submit form with valid data and show success toast', async () => {
    mockMutateAsync.mockResolvedValue({ success: true })

    render(<CreateAccountForm />, { wrapper: createWrapper() })

    const input = screen.getByLabelText(/customer number/i)
    fireEvent.change(input, { target: { value: '1000' } })

    const form = screen.getByRole('button', { name: /create account/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        customerNumber: 1000,
        type: 'CHECKING',
        currency: 'USD',
      })
    })
    expect(toast.success).toHaveBeenCalledWith('Account created successfully')
  })

  it('should show error toast on mutation failure', async () => {
    mockMutateAsync.mockRejectedValue(new Error('Creation failed'))

    render(<CreateAccountForm />, { wrapper: createWrapper() })

    const input = screen.getByLabelText(/customer number/i)
    fireEvent.change(input, { target: { value: '1000' } })

    const form = screen.getByRole('button', { name: /create account/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Creation failed')
    })
  })

  it('should disable submit button while mutation is pending', () => {
    mockUseCreateAccount.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    })

    render(<CreateAccountForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: /create account/i })
    expect(submitButton).toHaveAttribute('disabled')
  })

  it('should call onSuccess callback after successful creation', async () => {
    mockMutateAsync.mockResolvedValue({ success: true })
    const onSuccess = vi.fn()

    render(<CreateAccountForm onSuccess={onSuccess} />, { wrapper: createWrapper() })

    const input = screen.getByLabelText(/customer number/i)
    fireEvent.change(input, { target: { value: '1000' } })

    const form = screen.getByRole('button', { name: /create account/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledOnce()
    })
  })

  it('should reset form after successful creation', async () => {
    mockMutateAsync.mockResolvedValue({ success: true })

    render(<CreateAccountForm />, { wrapper: createWrapper() })

    const input = screen.getByLabelText(/customer number/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: '1000' } })

    const form = screen.getByRole('button', { name: /create account/i }).closest('form')!
    fireEvent.submit(form)

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
})
