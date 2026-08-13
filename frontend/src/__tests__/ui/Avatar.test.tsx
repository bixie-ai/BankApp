import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Avatar } from '@components/ui/Avatar'

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="/photo.jpg" name="John Doe" />)
    const img = screen.getByRole('img')
    expect(img.tagName).toBe('IMG')
    expect(img).toHaveAttribute('src', '/photo.jpg')
  })

  it('renders initials when no src', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders single initial for single name', () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders ? when no name or src', () => {
    render(<Avatar />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('uses alt from prop over name for img', () => {
    render(<Avatar src="/photo.jpg" name="John" alt="Profile picture" />)
    expect(screen.getByAltText('Profile picture')).toBeInTheDocument()
  })

  it('renders small size', () => {
    render(<Avatar name="AB" size="sm" />)
    expect(screen.getByRole('img').className).toContain('h-8')
  })

  it('renders large size', () => {
    render(<Avatar name="AB" size="lg" />)
    expect(screen.getByRole('img').className).toContain('h-12')
  })

  it('renders xl size', () => {
    render(<Avatar name="AB" size="xl" />)
    expect(screen.getByRole('img').className).toContain('h-16')
  })

  it('applies custom className', () => {
    render(<Avatar name="AB" className="custom" />)
    expect(screen.getByRole('img').className).toContain('custom')
  })

  it('passes accessibility checks with image', async () => {
    const { container } = render(<Avatar src="/photo.jpg" name="John Doe" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes accessibility checks with initials', async () => {
    const { container } = render(<Avatar name="John Doe" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
