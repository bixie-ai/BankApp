import { z } from 'zod'

/**
 * Validates the payload for initiating a fund transfer between accounts.
 * Applied before submitting transfer requests to ensure required fields are present
 * and the amount is a positive number.
 */
export const TransferRequestSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(1),
  description: z.string(),
})

/** Inferred TypeScript type representing a validated transfer request payload. */
export type TransferRequestDto = z.infer<typeof TransferRequestSchema>
