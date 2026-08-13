import { useQuery } from '@tanstack/react-query'
import { accountService } from '@infrastructure/api/services/account.service'

const TRANSACTIONS_KEY = 'transactions'

/** Parameters for the useTransactions hook controlling pagination and account scope. */
export interface UseTransactionsParams {
  /** The account ID whose transactions to fetch. */
  accountId: string
  /** Zero-based page index for pagination. Defaults to 0. */
  page?: number
  /** Number of transactions per page. Defaults to 10. */
  size?: number
}

/**
 * Fetches a paginated list of transactions for a specific account.
 * The query is keyed by accountId, page, and size so that navigating
 * between pages or switching accounts triggers a fresh fetch.
 * Disabled when accountId is falsy to avoid invalid API calls.
 *
 * @returns A React Query result containing the transactions page, loading state, and error state.
 */
export function useTransactions({ accountId, page = 0, size = 10 }: UseTransactionsParams) {
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, accountId, page, size],
    queryFn: () => accountService.getTransactions(accountId, { page, size }),
    enabled: !!accountId,
  })
}
