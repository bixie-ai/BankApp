/** Distinguishes the financial product type of a bank account. */
export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT'

/** Lifecycle state of an account, controlling whether operations are permitted. */
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED'

/** Represents a single bank account belonging to a customer. */
export interface Account {
  /** Unique identifier for the account. */
  id: string
  /** References the owning customer's ID. */
  customerId: string
  /** Human-readable account number used in external communications. */
  accountNumber: string
  /** Financial product type (checking, savings, or credit). */
  type: AccountType
  /** Current lifecycle state governing allowed operations. */
  status: AccountStatus
  /** Current balance in the smallest currency unit. */
  balance: number
  /** ISO 4217 currency code (e.g., "USD"). */
  currency: string
  /** ISO 8601 timestamp of when the account was opened. */
  createdAt: string
  /** ISO 8601 timestamp of the last modification. */
  updatedAt: string
}
