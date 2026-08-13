import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Badge } from '@components/ui/Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText('Default').className).toContain('bg-neutral-100')
  })

  it('renders success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText('Success').className).toContain('bg-green-50')
  })

  it('renders warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning').className).toContain('bg-yellow-50')
  })

  it('renders error variant', () => {
    render(<Badge variant="error">Error</Badge>)
    expect(screen.getByText('Error').className).toContain('bg-red-50')
  })

  it('renders info variant', () => {
    render(<Badge variant="info">Info</Badge>)
    expect(screen.getByText('Info').className).toContain('bg-blue-50')
  })

  it('applies custom className', () => {
    render(<Badge className="extra">Text</Badge>)
    expect(screen.getByText('Text').className).toContain('extra')
  })

  it('passes accessibility checks', async () => {
    const { container } = render(<Badge>Accessible</Badge>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
