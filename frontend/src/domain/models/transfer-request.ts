/** Payload submitted to initiate a funds transfer between two accounts. */
export interface TransferRequest {
  /** Source account to debit. */
  fromAccountId: string
  /** Destination account to credit. */
  toAccountId: string
  /** Amount to transfer; must be a positive value. */
  amount: number
  /** ISO 4217 currency code for the transfer (e.g., "USD"). */
  currency: string
  /** User-provided memo describing the purpose of the transfer. */
  description: string
}
