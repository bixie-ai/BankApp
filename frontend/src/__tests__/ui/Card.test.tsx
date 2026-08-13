import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Card, CardHeader } from '@components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies medium padding by default', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstElementChild?.className).toContain('p-6')
  })

  it('applies no padding', () => {
    const { container } = render(<Card padding="none">Content</Card>)
    expect(container.firstElementChild?.className).not.toContain('p-')
  })

  it('applies small padding', () => {
    const { container } = render(<Card padding="sm">Content</Card>)
    expect(container.firstElementChild?.className).toContain('p-4')
  })

  it('applies large padding', () => {
    const { container } = render(<Card padding="lg">Content</Card>)
    expect(container.firstElementChild?.className).toContain('p-8')
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom">Content</Card>)
    expect(container.firstElementChild?.className).toContain('custom')
  })

  it('passes accessibility checks', async () => {
    const { container } = render(<Card>Content</Card>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('CardHeader', () => {
  it('renders title', () => {
    render(<CardHeader title="Card Title" />)
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<CardHeader title="Title" description="A description" />)
    expect(screen.getByText('A description')).toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<CardHeader title="Title" action={<button>Action</button>} />)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
})
