import type { HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Semantic color variants that communicate status or category to the user. */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

/** Props for the {@link Badge} component. */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color variant conveying the semantic meaning of the badge. Defaults to 'default'. */
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
}

/**
 * Renders a small, pill-shaped label used to highlight status, category, or
 * metadata. Typically placed alongside titles, in tables, or within list items.
 *
 * @returns A styled inline span element containing the badge content.
 */
export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
