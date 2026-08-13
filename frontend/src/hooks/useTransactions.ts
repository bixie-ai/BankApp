import { useQuery } from '@tanstack/react-query'
import { accountService } from '@infrastructure/api/services/account.service'

const TRANSACTIONS_KEY = 'transactions'

export interface UseTransactionsParams {
  accountId: string
  page?: number
  size?: number
}

export function useTransactions({ accountId, page = 0, size = 10 }: UseTransactionsParams) {
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, accountId, page, size],
    queryFn: () => accountService.getTransactions(accountId, { page, size }),
    enabled: !!accountId,
  })
}
