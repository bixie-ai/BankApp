import type { ImgHTMLAttributes } from 'react'
import { cn } from '@lib/cn'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  size?: AvatarSize
  name?: string
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
