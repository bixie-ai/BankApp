import { forwardRef, type SelectHTMLAttributes, useId } from 'react'
import { cn } from '@lib/cn'

/** Represents a single option within a Select dropdown. */
export interface SelectOption {
  /** The underlying value submitted with the form. */
  value: string
  /** The human-readable text displayed to the user. */
  label: string
  /** When true, the option is visible but not selectable. */
  disabled?: boolean
}

/** Props for the {@link Select} component. */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Visible label rendered above the select element. */
  label?: string
  /** Error message displayed below the select; also triggers error styling. */
  error?: string
  /** Supplementary hint text shown below the select when no error is present. */
  helperText?: string
  /** The list of options to render inside the dropdown. */
  options: SelectOption[]
  /** Placeholder text shown as a disabled first option when no value is selected. */
  placeholder?: string
  /** Controls the padding and font size of the select element. */
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
}

/**
 * A styled native select dropdown with support for labels, validation errors,
 * and helper text. Wraps the native `<select>` element for full accessibility.
 *
 * @returns A labeled select field with optional error and helper text.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, size = 'md', disabled, className, id, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id ?? generatedId
    const errorId = error ? `${selectId}-error` : undefined
    const helperId = helperText ? `${selectId}-helper` : undefined

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
          className={cn(
            'w-full rounded-md border bg-white transition-colors duration-150 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20fill%3D%27%236B7280%27%3E%3Cpath%20fill-rule%3D%27evenodd%27%20d%3D%27M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%27%20clip-rule%3D%27evenodd%27%2F%3E%3C%2Fsvg%3E")] bg-[position:right_0.5rem_center] bg-no-repeat bg-[length:1.25rem]',
            'pr-10',
            error
              ? 'border-error text-neutral-900 focus:ring-error/50 focus:border-error'
              : 'border-neutral-300 text-neutral-900 focus:ring-primary-500/50 focus:border-primary-600',
            disabled && 'opacity-50 cursor-not-allowed bg-neutral-50',
            sizeStyles[size],
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select'
