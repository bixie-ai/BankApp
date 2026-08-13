import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@infrastructure/api/services/account.service'
import type { CreateAccountInput } from '@infrastructure/api/services/account.service'

const ACCOUNTS_KEY = 'accounts'

/**
 * Provides a mutation to create a new bank account for a customer.
 * On successful creation, automatically invalidates the accounts list cache
 * so that any displayed account lists reflect the newly created account.
 *
 * @returns A React Query mutation object with a mutate function accepting CreateAccountInput.
 */
export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountInput) => accountService.createForCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] })
    },
  })
}
