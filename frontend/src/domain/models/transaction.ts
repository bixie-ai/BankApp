/** Categorizes the direction or nature of a financial transaction. */
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'

/** Processing lifecycle state of a transaction. */
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

/** An immutable record of a single financial operation against an account. */
export interface Transaction {
  /** Unique identifier for this transaction. */
  id: string
  /** The account this transaction is applied to. */
  accountId: string
  /** Nature of the transaction (deposit, withdrawal, or transfer). */
  type: TransactionType
  /** Current processing state of the transaction. */
  status: TransactionStatus
  /** Monetary value of the transaction in the specified currency. */
  amount: number
  /** ISO 4217 currency code (e.g., "USD"). */
  currency: string
  /** Human-readable memo or reason for the transaction. */
  description: string
  /** Externally visible reference number for tracking and reconciliation. */
  referenceNumber: string
  /** ISO 8601 timestamp of when the transaction was initiated. */
  createdAt: string
}
