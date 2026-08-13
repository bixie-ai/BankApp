import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Input } from '@components/ui/Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Input label="Email" error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Email" error="Required" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('displays helper text', () => {
    render(<Input label="Email" helperText="We will never share your email" />)
    expect(screen.getByText('We will never share your email')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<Input label="Email" helperText="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('renders in disabled state', () => {
    render(<Input label="Email" disabled />)
    expect(screen.getByLabelText('Email')).toBeDisabled()
  })

  it('renders in readonly state', () => {
    render(<Input label="Email" readOnly value="test@test.com" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('readOnly')
  })

  it('renders small size', () => {
    render(<Input size="sm" placeholder="small" />)
    expect(screen.getByPlaceholderText('small').className).toContain('text-sm')
  })

  it('renders large size', () => {
    render(<Input size="lg" placeholder="large" />)
    expect(screen.getByPlaceholderText('large').className).toContain('text-lg')
  })

  it('applies error styles', () => {
    render(<Input label="Name" error="Required" />)
    expect(screen.getByLabelText('Name').className).toContain('border-error')
  })

  it('applies custom className', () => {
    render(<Input className="my-input" placeholder="test" />)
    expect(screen.getByPlaceholderText('test').className).toContain('my-input')
  })

  it('connects label and input via htmlFor/id', () => {
    render(<Input label="Username" id="user-input" />)
    const input = screen.getByLabelText('Username')
    expect(input.id).toBe('user-input')
  })

  it('is keyboard accessible (can be focused)', () => {
    render(<Input label="Focus test" />)
    const input = screen.getByLabelText('Focus test')
    input.focus()
    expect(document.activeElement).toBe(input)
  })

  it('passes accessibility checks', async () => {
    const { container } = render(<Input label="Name" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes accessibility checks with error', async () => {
    const { container } = render(<Input label="Name" error="Required" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
