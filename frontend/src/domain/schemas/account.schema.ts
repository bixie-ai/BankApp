import { z } from 'zod'

export const AccountTypeSchema = z.enum(['CHECKING', 'SAVINGS', 'CREDIT'])
export const AccountStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'CLOSED'])

export const AccountSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  accountNumber: z.string().min(1),
  type: AccountTypeSchema,
  status: AccountStatusSchema,
  balance: z.number(),
  currency: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type AccountDto = z.infer<typeof AccountSchema>
