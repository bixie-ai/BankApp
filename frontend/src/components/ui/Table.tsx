import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'
import { cn } from '@lib/cn'

/** Props for the {@link Table} component. */
export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

/**
 * Root table wrapper that provides horizontal scroll overflow and a rounded
 * bordered container. Use with {@link TableHeader}, {@link TableBody},
 * {@link TableRow}, {@link TableHead}, and {@link TableCell} for a complete table.
 *
 * @returns A responsive table wrapped in an overflow container.
 */
export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-neutral-200">
      <table className={cn('w-full text-sm text-left', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

/**
 * Renders the `<thead>` section with a subtle background to visually
 * distinguish column headers from data rows.
 *
 * @returns A styled table header section.
 */
export function TableHeader({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-neutral-50 border-b border-neutral-200', className)} {...props}>
      {children}
    </thead>
  )
}

/**
 * Renders the `<tbody>` section with dividers between rows for readability.
 *
 * @returns A styled table body section.
 */
export function TableBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-neutral-200', className)} {...props}>
      {children}
    </tbody>
  )
}

/**
 * A single table row with hover highlighting for improved scanability.
 *
 * @returns A styled `<tr>` element.
 */
export function TableRow({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-neutral-50 transition-colors', className)} {...props}>
      {children}
    </tr>
  )
}

/** Props for the {@link TableHead} component. */
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** When true, the column header is interactive and displays a sort indicator. */
  sortable?: boolean
  /** Current sort direction, or false if unsorted. Controls the displayed arrow icon and `aria-sort`. */
  sorted?: 'asc' | 'desc' | false
  /** Callback invoked when a sortable header is clicked. */
  onSort?: () => void
}

/**
 * A table column header cell (`<th>`) with optional sort interaction.
 * When `sortable` is true, clicking the header triggers the `onSort` callback
 * and a directional arrow is shown to reflect the current sort state.
 *
 * @returns A styled, optionally interactive, table header cell.
 */
export function TableHead({ sortable, sorted, onSort, className, children, ...props }: TableHeadProps) {
  const content = (
    <span className="flex items-center gap-1">
      {children}
      {sortable && (
        <span aria-hidden="true" className="text-neutral-400">
          {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
        </span>
      )}
    </span>
  )

  return (
    <th
      className={cn(
        'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-600',
        sortable && 'cursor-pointer select-none hover:text-neutral-900',
        className,
      )}
      onClick={sortable ? onSort : undefined}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
      {...props}
    >
      {content}
    </th>
  )
}

/**
 * A standard table data cell (`<td>`) with consistent padding and text color.
 *
 * @returns A styled table cell.
 */
export function TableCell({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3 text-neutral-700', className)} {...props}>
      {children}
    </td>
  )
}
