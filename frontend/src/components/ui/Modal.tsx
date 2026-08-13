import { useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Modal} component. */
export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the modal is currently visible. Controls rendering and body scroll lock. */
  open: boolean
  /** Callback invoked when the user dismisses the modal via backdrop click, Escape key, or close button. */
  onClose: () => void
  /** Optional heading displayed at the top of the modal dialog. */
  title?: string
  /** Optional descriptive text rendered below the title for additional context. */
  description?: string
  /** Content rendered inside the modal body. */
  children: ReactNode
  /** Maximum width of the modal panel. Defaults to 'md'. */
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

/**
 * Renders an accessible modal dialog with a backdrop overlay, focus trapping,
 * and Escape key dismissal. Locks body scroll while open and restores focus
 * to the previously active element on close.
 *
 * @returns A portal-style fixed overlay with a centered dialog panel, or null when closed.
 */
export function Modal({ open, onClose, title, description, children, size = 'md', className, ...props }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<Element | null>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      focusable?.focus()
    } else {
      if (previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus()
      }
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className={cn(
          'relative z-10 w-full rounded-lg bg-white shadow-xl p-6',
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900 mb-1">
            {title}
          </h2>
        )}
        {description && (
          <p id="modal-description" className="text-sm text-neutral-500 mb-4">
            {description}
          </p>
        )}
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}
