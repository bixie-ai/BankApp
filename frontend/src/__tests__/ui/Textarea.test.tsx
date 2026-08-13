import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Textarea } from '@components/ui/Textarea'

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea label="Message" />)
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA')
  })

  it('renders with label', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('displays error message', () => {
    render(<Textarea label="Notes" error="Too short" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Too short')
  })

  it('sets aria-invalid on error', () => {
    render(<Textarea label="Notes" error="Required" />)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true')
  })

  it('displays helper text', () => {
    render(<Textarea label="Notes" helperText="Max 500 chars" />)
    expect(screen.getByText('Max 500 chars')).toBeInTheDocument()
  })

  it('hides helper text when error is present', () => {
    render(<Textarea label="Notes" helperText="Help" error="Error" />)
    expect(screen.queryByText('Help')).not.toBeInTheDocument()
  })

  it('renders disabled state', () => {
    render(<Textarea label="Notes" disabled />)
    expect(screen.getByLabelText('Notes')).toBeDisabled()
  })

  it('renders readonly state', () => {
    render(<Textarea label="Notes" readOnly />)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('readOnly')
  })

  it('applies error border styles', () => {
    render(<Textarea label="Notes" error="Err" />)
    expect(screen.getByLabelText('Notes').className).toContain('border-error')
  })

  it('applies custom className', () => {
    render(<Textarea label="Notes" className="my-class" />)
    expect(screen.getByLabelText('Notes').className).toContain('my-class')
  })

  it('is keyboard accessible', () => {
    render(<Textarea label="Focus" />)
    const textarea = screen.getByLabelText('Focus')
    textarea.focus()
    expect(document.activeElement).toBe(textarea)
  })

  it('passes accessibility checks', async () => {
    const { container } = render(<Textarea label="Accessible" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
