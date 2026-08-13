import { z } from 'zod'

/** Validates the category of a bank account. Used to enforce allowed account types across the UI. */
export const AccountTypeSchema = z.enum(['CHECKING', 'SAVINGS', 'CREDIT'])

/** Validates the lifecycle state of an account. Determines whether operations can be performed on it. */
export const AccountStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'CLOSED'])

/**
 * Validates the full account data shape returned by the accounts API.
 * Applied when parsing API responses to ensure type safety at the boundary layer.
 */
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

/** Inferred TypeScript type representing a validated account record. */
export type AccountDto = z.infer<typeof AccountSchema>
