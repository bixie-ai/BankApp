import type { HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Container} component. */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum width breakpoint the container constrains its content to. Defaults to 'xl'. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const sizeStyles = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

/**
 * Renders a horizontally centered, width-constrained wrapper that provides
 * consistent responsive padding. Use as a page-level layout primitive to
 * prevent content from stretching too wide on large screens.
 *
 * @returns A div element with max-width constraint and horizontal auto margins.
 */
export function Container({ size = 'xl', className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeStyles[size], className)} {...props}>
      {children}
    </div>
  )
}
