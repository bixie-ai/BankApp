import { useQuery } from '@tanstack/react-query'
import { accountService } from '@infrastructure/api/services/account.service'

const ACCOUNT_KEY = 'account'

/**
 * Fetches a single account by its ID using a cached query.
 * The query is disabled until a valid accountId is provided,
 * preventing unnecessary API calls during initial render or navigation.
 *
 * @returns A React Query result containing the account data, loading state, and error state.
 */
export function useAccount(accountId: string | undefined) {
  return useQuery({
    queryKey: [ACCOUNT_KEY, accountId],
    queryFn: () => accountService.getById(accountId!),
    enabled: accountId !== undefined,
  })
}
