import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges class names using clsx for conditional logic and tailwind-merge to resolve Tailwind CSS conflicts.
 * @param inputs - Class values (strings, arrays, or conditional objects) to merge
 * @returns A single deduplicated class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
