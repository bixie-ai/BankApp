import { render } from '@testing-library/react'
import { Skeleton } from '@components/ui/Skeleton'

describe('Skeleton', () => {
  it('renders with text variant by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstElementChild?.className).toContain('h-4')
    expect(container.firstElementChild?.className).toContain('rounded')
  })

  it('renders with circular variant', () => {
    const { container } = render(<Skeleton variant="circular" />)
    expect(container.firstElementChild?.className).toContain('rounded-full')
  })

  it('renders with rectangular variant', () => {
    const { container } = render(<Skeleton variant="rectangular" />)
    expect(container.firstElementChild?.className).toContain('rounded-md')
  })

  it('applies custom width and height', () => {
    const { container } = render(<Skeleton width={200} height={100} />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('200px')
    expect(el.style.height).toBe('100px')
  })

  it('applies string width and height', () => {
    const { container } = render(<Skeleton width="50%" height="2rem" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.style.width).toBe('50%')
    expect(el.style.height).toBe('2rem')
  })

  it('has aria-hidden true', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies animate-pulse class', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstElementChild?.className).toContain('animate-pulse')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="my-skeleton" />)
    expect(container.firstElementChild?.className).toContain('my-skeleton')
  })
})
