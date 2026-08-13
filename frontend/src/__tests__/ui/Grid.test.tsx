import { render, screen } from '@testing-library/react'
import { Grid } from '@components/ui/Grid'

describe('Grid', () => {
  it('renders children', () => {
    render(<Grid><div>Item</div></Grid>)
    expect(screen.getByText('Item')).toBeInTheDocument()
  })

  it('applies grid class', () => {
    const { container } = render(<Grid><div>A</div></Grid>)
    expect(container.firstElementChild?.className).toContain('grid')
  })

  it('applies 2 column layout', () => {
    const { container } = render(<Grid cols={2}><div>A</div></Grid>)
    expect(container.firstElementChild?.className).toContain('sm:grid-cols-2')
  })

  it('applies 3 column layout', () => {
    const { container } = render(<Grid cols={3}><div>A</div></Grid>)
    expect(container.firstElementChild?.className).toContain('lg:grid-cols-3')
  })

  it('applies no gap', () => {
    const { container } = render(<Grid gap="none"><div>A</div></Grid>)
    expect(container.firstElementChild?.className).toContain('gap-0')
  })

  it('applies large gap', () => {
    const { container } = render(<Grid gap="lg"><div>A</div></Grid>)
    expect(container.firstElementChild?.className).toContain('gap-8')
  })

  it('applies custom className', () => {
    const { container } = render(<Grid className="custom"><div>A</div></Grid>)
    expect(container.firstElementChild?.className).toContain('custom')
  })
})
