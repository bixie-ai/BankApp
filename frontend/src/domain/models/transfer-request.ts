export interface TransferRequest {
  fromAccountId: string
  toAccountId: string
  amount: number
  currency: string
  description: string
}
