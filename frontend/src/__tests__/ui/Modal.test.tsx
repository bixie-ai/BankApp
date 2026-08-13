import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Modal } from '@components/ui/Modal'

describe('Modal', () => {
  const onClose = vi.fn()

  beforeEach(() => {
    onClose.mockClear()
  })

  it('renders nothing when open is false', () => {
    render(<Modal open={false} onClose={onClose} title="Test">Content</Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open is true', () => {
    render(<Modal open={true} onClose={onClose} title="Test">Content</Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders title', () => {
    render(<Modal open={true} onClose={onClose} title="My Title">Content</Modal>)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<Modal open={true} onClose={onClose} description="Some desc">Content</Modal>)
    expect(screen.getByText('Some desc')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(<Modal open={true} onClose={onClose}>Modal body</Modal>)
    expect(screen.getByText('Modal body')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(<Modal open={true} onClose={onClose} title="X">Content</Modal>)
    fireEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed', () => {
    render(<Modal open={true} onClose={onClose}>Content</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    render(<Modal open={true} onClose={onClose}>Content</Modal>)
    const backdrop = screen.getByRole('dialog').parentElement?.querySelector('[aria-hidden="true"]')
    fireEvent.click(backdrop!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has aria-modal attribute', () => {
    render(<Modal open={true} onClose={onClose}>Content</Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('has aria-labelledby when title is provided', () => {
    render(<Modal open={true} onClose={onClose} title="Title">Content</Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('passes accessibility checks', async () => {
    const { container } = render(
      <Modal open={true} onClose={onClose} title="Accessible Modal">
        <p>Modal content here</p>
      </Modal>,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
