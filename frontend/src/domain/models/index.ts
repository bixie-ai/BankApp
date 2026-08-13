/**
 * Domain models barrel file.
 * Re-exports all shared TypeScript interfaces and type aliases
 * used across the frontend application.
 */
export type { Customer } from './customer'
export type { Account, AccountType, AccountStatus } from './account'
export type { Transaction, TransactionType, TransactionStatus } from './transaction'
export type { TransferRequest } from './transfer-request'
export type { ApiResponse } from './api-response'
