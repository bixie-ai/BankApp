import type { HTMLAttributes, ElementType } from 'react'
import { cn } from '@lib/cn'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption'

/** Props for the {@link Typography} component. */
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  /** The typographic scale to apply (heading levels, body, or caption). Determines font size, weight, and color. */
  variant?: TypographyVariant
  /** Override the default HTML element rendered for the chosen variant (e.g. render an `h2` style as a `span`). */
  as?: ElementType
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-4xl font-bold tracking-tight text-neutral-900',
  h2: 'text-3xl font-semibold tracking-tight text-neutral-900',
  h3: 'text-2xl font-semibold text-neutral-900',
  h4: 'text-xl font-medium text-neutral-900',
  body: 'text-base text-neutral-700',
  bodySmall: 'text-sm text-neutral-600',
  caption: 'text-xs text-neutral-500',
}

const defaultElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  bodySmall: 'p',
  caption: 'span',
}

/**
 * A polymorphic text component that maps semantic typography variants to
 * consistent font sizes, weights, and colors. The rendered HTML element
 * defaults to the semantic match for the variant but can be overridden via `as`.
 *
 * @returns A text element styled according to the chosen typographic variant.
 */
export function Typography({ variant = 'body', as, className, children, ...props }: TypographyProps) {
  const Component = as ?? defaultElements[variant]

  return (
    <Component className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  )
}
