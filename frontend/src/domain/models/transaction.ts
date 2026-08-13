export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface Transaction {
  id: string
  accountId: string
  type: TransactionType
  status: TransactionStatus
  amount: number
  currency: string
  description: string
  referenceNumber: string
  createdAt: string
}
