import { render, screen } from '@testing-library/react'
import { Container } from '@components/ui/Container'

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Page content</Container>)
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('applies xl max-width by default', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstElementChild?.className).toContain('max-w-screen-xl')
  })

  it('applies sm max-width', () => {
    const { container } = render(<Container size="sm">Content</Container>)
    expect(container.firstElementChild?.className).toContain('max-w-screen-sm')
  })

  it('applies full width', () => {
    const { container } = render(<Container size="full">Content</Container>)
    expect(container.firstElementChild?.className).toContain('max-w-full')
  })

  it('has horizontal padding', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstElementChild?.className).toContain('px-4')
  })

  it('is centered with mx-auto', () => {
    const { container } = render(<Container>Content</Container>)
    expect(container.firstElementChild?.className).toContain('mx-auto')
  })

  it('applies custom className', () => {
    const { container } = render(<Container className="extra">Content</Container>)
    expect(container.firstElementChild?.className).toContain('extra')
  })
})
