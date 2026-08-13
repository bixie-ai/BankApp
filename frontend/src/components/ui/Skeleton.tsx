import type { HTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Skeleton} component. */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** The shape of the placeholder: text line, circle (e.g. avatar), or rectangle (e.g. image). */
  variant?: 'text' | 'circular' | 'rectangular'
  /** Explicit width; accepts CSS length strings or pixel numbers. */
  width?: string | number
  /** Explicit height; accepts CSS length strings or pixel numbers. */
  height?: string | number
}

/**
 * A pulsing placeholder element used to indicate loading content before the
 * actual data arrives. Hidden from assistive technology via `aria-hidden`.
 *
 * @returns A decorative animated div mimicking the shape of forthcoming content.
 */
export function Skeleton({ variant = 'text', width, height, className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse bg-neutral-200',
        variant === 'text' && 'h-4 rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-md',
        className,
      )}
      style={{ width, height }}
      {...props}
    />
  )
}
