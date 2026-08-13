import { z } from 'zod'

/** Validates the kind of financial transaction. Used to categorize ledger entries. */
export const TransactionTypeSchema = z.enum(['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'])

/** Validates the processing state of a transaction. Drives UI status indicators and retry logic. */
export const TransactionStatusSchema = z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'])

/**
 * Validates a single transaction record from the transactions API.
 * Ensures amounts are positive and timestamps conform to ISO 8601.
 * Applied when parsing transaction history responses.
 */
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

/** Inferred TypeScript type representing a validated transaction record. */
export type TransactionDto = z.infer<typeof TransactionSchema>
