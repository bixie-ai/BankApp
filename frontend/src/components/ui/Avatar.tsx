import type { ImgHTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Available size presets for the Avatar component. */
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

/** Props for the {@link Avatar} component. */
export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  /** Visual size of the avatar circle. Defaults to 'md'. */
  size?: AvatarSize
  /** Full name used to derive initials when no image source is provided. */
  name?: string
  /** URL of the user's profile image. When provided, renders an img element instead of initials. */
  src?: string
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return (parts[0]?.[0] ?? '').toUpperCase()
  return ((parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase()
}

/**
 * Renders a circular avatar displaying either a user's profile image or their
 * computed initials as a fallback. Useful for representing users in lists,
 * headers, and comment threads.
 *
 * @returns An img element when `src` is provided, otherwise a span with initials.
 */
export function Avatar({ size = 'md', name, src, alt, className, ...props }: AvatarProps) {
  const initials = name ? getInitials(name) : '?'
  const label = alt ?? name ?? 'Avatar'

  if (src) {
    return (
      <img
        src={src}
        alt={label}
        className={cn(
          'rounded-full object-cover inline-block',
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-700 font-medium',
        sizeStyles[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}
