/**
 * Public API for domain validation schemas.
 * Re-exports all Zod schemas and their inferred DTO types used to validate
 * data at API boundaries throughout the application.
 */
export { CustomerSchema, type CustomerDto } from './customer.schema'
export {
  AccountSchema,
  AccountTypeSchema,
  AccountStatusSchema,
  type AccountDto,
} from './account.schema'
export {
  TransactionSchema,
  TransactionTypeSchema,
  TransactionStatusSchema,
  type TransactionDto,
} from './transaction.schema'
export { TransferRequestSchema, type TransferRequestDto } from './transfer-request.schema'
export { createApiResponseSchema, type ApiResponseDto } from './api-response.schema'
