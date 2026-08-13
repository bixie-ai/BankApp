import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Select } from '@components/ui/Select'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C', disabled: true },
]

describe('Select', () => {
  it('renders options', () => {
    render(<Select options={options} label="Choice" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('Option A')).toBeInTheDocument()
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  it('renders with label', () => {
    render(<Select options={options} label="Choose" />)
    expect(screen.getByLabelText('Choose')).toBeInTheDocument()
  })

  it('renders placeholder', () => {
    render(<Select options={options} label="Pick" placeholder="Select one..." />)
    expect(screen.getByText('Select one...')).toBeInTheDocument()
  })

  it('renders disabled options', () => {
    render(<Select options={options} label="Opts" />)
    const disabledOpt = screen.getByText('Option C').closest('option')
    expect(disabledOpt).toBeDisabled()
  })

  it('displays error', () => {
    render(<Select options={options} label="Type" error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('sets aria-invalid on error', () => {
    render(<Select options={options} label="Type" error="Required" />)
    expect(screen.getByLabelText('Type')).toHaveAttribute('aria-invalid', 'true')
  })

  it('displays helper text', () => {
    render(<Select options={options} label="Type" helperText="Pick one" />)
    expect(screen.getByText('Pick one')).toBeInTheDocument()
  })

  it('hides helper text when error is shown', () => {
    render(<Select options={options} label="Type" helperText="Help" error="Error" />)
    expect(screen.queryByText('Help')).not.toBeInTheDocument()
  })

  it('renders disabled state', () => {
    render(<Select options={options} label="Type" disabled />)
    expect(screen.getByLabelText('Type')).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Select options={options} label="X" className="custom" />)
    expect(screen.getByLabelText('X').className).toContain('custom')
  })

  it('is keyboard accessible', () => {
    render(<Select options={options} label="Navigate" />)
    const select = screen.getByLabelText('Navigate')
    select.focus()
    expect(document.activeElement).toBe(select)
  })

  it('passes accessibility checks', async () => {
    const { container } = render(<Select options={options} label="Accessible" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
