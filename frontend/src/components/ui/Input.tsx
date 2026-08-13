import { forwardRef, type InputHTMLAttributes, useId } from 'react'
import { cn } from '@lib/cn'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, size = 'md', disabled, readOnly, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full rounded-md border bg-white transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'placeholder:text-neutral-400',
            error
              ? 'border-error text-neutral-900 focus:ring-error/50 focus:border-error'
              : 'border-neutral-300 text-neutral-900 focus:ring-primary-500/50 focus:border-primary-600',
            disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
            readOnly && 'bg-neutral-50 cursor-default',
            sizeStyles[size],
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

Input.displayName = 'Input'
