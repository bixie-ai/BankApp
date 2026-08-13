import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Typography } from '@components/ui/Typography'

describe('Typography', () => {
  it('renders as p by default (body variant)', () => {
    render(<Typography>Body text</Typography>)
    expect(screen.getByText('Body text').tagName).toBe('P')
  })

  it('renders h1 for h1 variant', () => {
    render(<Typography variant="h1">Heading 1</Typography>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1')
  })

  it('renders h2 for h2 variant', () => {
    render(<Typography variant="h2">Heading 2</Typography>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2')
  })

  it('renders h3 for h3 variant', () => {
    render(<Typography variant="h3">Heading 3</Typography>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3')
  })

  it('renders h4 for h4 variant', () => {
    render(<Typography variant="h4">Heading 4</Typography>)
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Heading 4')
  })

  it('renders as span for caption variant', () => {
    render(<Typography variant="caption">Caption text</Typography>)
    expect(screen.getByText('Caption text').tagName).toBe('SPAN')
  })

  it('allows overriding element with as prop', () => {
    render(<Typography variant="h1" as="div">Custom element</Typography>)
    expect(screen.getByText('Custom element').tagName).toBe('DIV')
  })

  it('applies variant styles', () => {
    render(<Typography variant="h1">Styled</Typography>)
    expect(screen.getByText('Styled').className).toContain('text-4xl')
  })

  it('applies custom className', () => {
    render(<Typography className="my-class">Text</Typography>)
    expect(screen.getByText('Text').className).toContain('my-class')
  })

  it('passes accessibility checks for headings', async () => {
    const { container } = render(
      <div>
        <Typography variant="h1">Title</Typography>
        <Typography variant="body">Content</Typography>
      </div>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
