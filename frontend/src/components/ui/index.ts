/**
 * UI component library barrel file.
 *
 * Re-exports all shared UI primitives so consumers can import from a single
 * path (e.g. `import { Button, Input } from '@components/ui'`).
 *
 * @module ui
 */

export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button'
export { Input, type InputProps } from './Input'
export { Badge, type BadgeProps, type BadgeVariant } from './Badge'
export { Typography, type TypographyProps } from './Typography'
export { Card, CardHeader, type CardProps, type CardHeaderProps } from './Card'
export { Select, type SelectProps, type SelectOption } from './Select'
export { Textarea, type TextareaProps } from './Textarea'
export { Avatar, type AvatarProps, type AvatarSize } from './Avatar'
export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, type TableProps, type TableHeadProps } from './Table'
export { Modal, type ModalProps } from './Modal'
export { Toast, type ToastProps, type ToastVariant } from './Toast'
export { Skeleton, type SkeletonProps } from './Skeleton'
export { Grid, type GridProps } from './Grid'
export { Container, type ContainerProps } from './Container'
