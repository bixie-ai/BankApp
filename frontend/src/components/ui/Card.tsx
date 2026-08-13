import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Card} component. */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Internal padding of the card surface. Defaults to 'md'. */
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * Renders a bordered, elevated surface used to group related content visually.
 * Serves as a generic container for sections, forms, or data displays.
 *
 * @returns A rounded div with border, background, and shadow styling.
 */
export function Card({ padding = 'md', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-neutral-200 bg-white shadow-sm',
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Props for the {@link CardHeader} component. */
export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Primary heading text or element displayed in the card header. */
  title: ReactNode
  /** Optional secondary text rendered below the title for additional context. */
  description?: ReactNode
  /** Optional action element (e.g., a button) aligned to the right of the header. */
  action?: ReactNode
}

/**
 * Renders the top section of a Card with a title, optional description, and
 * an optional trailing action element. Intended to be placed as the first
 * child inside a Card.
 *
 * @returns A flex container with title/description on the left and action on the right.
 */
export function CardHeader({ title, description, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 pb-4', className)} {...props}>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
