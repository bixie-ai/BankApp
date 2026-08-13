export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT'
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED'

export interface Account {
  id: string
  customerId: string
  accountNumber: string
  type: AccountType
  status: AccountStatus
  balance: number
  currency: string
  createdAt: string
  updatedAt: string
}
