import { forwardRef, type TextareaHTMLAttributes, useId } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Textarea} component. */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label rendered above the textarea. */
  label?: string
  /** Error message displayed below the textarea; also triggers error styling. */
  error?: string
  /** Supplementary hint text shown below the textarea when no error is present. */
  helperText?: string
}

/**
 * A multi-line text input with integrated label, validation error display,
 * and helper text. Supports vertical resizing and read-only mode.
 *
 * @returns A labeled textarea field with optional error and helper text.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, disabled, readOnly, className, id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId
    const errorId = error ? `${textareaId}-error` : undefined
    const helperId = helperText ? `${textareaId}-helper` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full rounded-md border bg-white px-4 py-2 text-base transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'placeholder:text-neutral-400 resize-y min-h-[80px]',
            error
              ? 'border-error text-neutral-900 focus:ring-error/50 focus:border-error'
              : 'border-neutral-300 text-neutral-900 focus:ring-primary-500/50 focus:border-primary-600',
            disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
            readOnly && 'bg-neutral-50 cursor-default',
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
