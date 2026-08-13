import { z } from 'zod'

export const TransactionTypeSchema = z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'])
export const TransactionStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'])

export const TransactionSchema = z.object({
  id: z.string().min(1),
  accountId: z.string().min(1),
  type: TransactionTypeSchema,
  status: TransactionStatusSchema,
  amount: z.number().positive(),
  currency: z.string().min(1),
  description: z.string(),
  referenceNumber: z.string().min(1),
  createdAt: z.string().datetime(),
})

export type TransactionDto = z.infer<typeof TransactionSchema>
