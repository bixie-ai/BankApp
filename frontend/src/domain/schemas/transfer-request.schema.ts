import { z } from 'zod'

export const TransferRequestSchema = z.object({
  fromAccountId: z.string().min(1),
  toAccountId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().min(1),
  description: z.string(),
})

export type TransferRequestDto = z.infer<typeof TransferRequestSchema>
