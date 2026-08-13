import { render, screen, fireEvent, act } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Toast } from '@components/ui/Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders message', () => {
    render(<Toast message="Success!" variant="success" />)
    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('renders with success variant', () => {
    render(<Toast message="Done" variant="success" />)
    expect(screen.getByRole('alert').className).toContain('bg-green-50')
  })

  it('renders with error variant', () => {
    render(<Toast message="Failed" variant="error" />)
    expect(screen.getByRole('alert').className).toContain('bg-red-50')
  })

  it('renders with warning variant', () => {
    render(<Toast message="Warn" variant="warning" />)
    expect(screen.getByRole('alert').className).toContain('bg-yellow-50')
  })

  it('renders with info variant (default)', () => {
    render(<Toast message="Info" />)
    expect(screen.getByRole('alert').className).toContain('bg-blue-50')
  })

  it('auto-dismisses after duration', () => {
    const onClose = vi.fn()
    render(<Toast message="Auto" duration={3000} onClose={onClose} />)
    act(() => { vi.advanceTimersByTime(3000) })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when open is false', () => {
    render(<Toast message="Hidden" open={false} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders dismiss button when onClose is provided', () => {
    render(<Toast message="Dismissable" onClose={() => {}} />)
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument()
  })

  it('calls onClose on dismiss click', () => {
    const onClose = vi.fn()
    render(<Toast message="Close me" onClose={onClose} />)
    fireEvent.click(screen.getByLabelText('Dismiss'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has role=alert', () => {
    render(<Toast message="Alert" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('passes accessibility checks', async () => {
    vi.useRealTimers()
    const { container } = render(<Toast message="Accessible toast" variant="success" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
