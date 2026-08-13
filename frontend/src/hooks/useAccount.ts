import { useQuery } from '@tanstack/react-query'
import { accountService } from '@infrastructure/api/services/account.service'

const ACCOUNT_KEY = 'account'

export function useAccount(accountId: string | undefined) {
  return useQuery({
    queryKey: [ACCOUNT_KEY, accountId],
    queryFn: () => accountService.getById(accountId!),
    enabled: accountId !== undefined,
  })
}
