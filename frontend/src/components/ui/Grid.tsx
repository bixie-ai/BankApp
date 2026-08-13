import type { HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Grid} component. */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns at the largest breakpoint. Columns collapse responsively on smaller screens. Defaults to 1. */
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  /** Spacing between grid items. Defaults to 'md'. */
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

const colStyles = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-12',
}

const gapStyles = {
  none: 'gap-0',
  sm: 'gap-3',
  md: 'gap-6',
  lg: 'gap-8',
}

/**
 * Renders a responsive CSS Grid layout that automatically adjusts column
 * count at mobile, tablet, and desktop breakpoints. Simplifies building
 * card grids, form layouts, and dashboard panels.
 *
 * @returns A div element with CSS Grid styling applied.
 */
export function Grid({ cols = 1, gap = 'md', className, children, ...props }: GridProps) {
  return (
    <div className={cn('grid', colStyles[cols], gapStyles[gap], className)} {...props}>
      {children}
    </div>
  )
}
