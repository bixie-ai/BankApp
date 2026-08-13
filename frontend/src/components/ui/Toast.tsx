import { useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Visual style variants indicating the severity or nature of a toast notification. */
export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

/** Props for the {@link Toast} component. */
export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** The visual style conveying the toast's intent (success, error, etc.). */
  variant?: ToastVariant
  /** The notification text displayed to the user. */
  message: string
  /** Controls visibility; when toggled to true the toast appears and starts its auto-dismiss timer. */
  open?: boolean
  /** Callback invoked when the toast is dismissed, either manually or after the duration elapses. */
  onClose?: () => void
  /** Time in milliseconds before the toast auto-dismisses. Set to 0 to disable auto-dismiss. */
  duration?: number
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
}

const iconMap: Record<ToastVariant, string> = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
  warning: '⚠',
}

/**
 * A transient notification banner that communicates brief feedback to the user.
 * Supports multiple severity variants, auto-dismiss after a configurable duration,
 * and an optional manual dismiss button.
 *
 * @returns A dismissible alert banner, or null when not visible.
 */
export function Toast({ variant = 'info', message, open = true, onClose, duration = 5000, className, ...props }: ToastProps) {
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    setVisible(open)
  }, [open])

  useEffect(() => {
    if (!visible || duration <= 0) return
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [visible, duration, onClose])

  if (!visible) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="text-lg">{iconMap[variant]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={() => { setVisible(false); onClose() }}
          className="text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  )
}
