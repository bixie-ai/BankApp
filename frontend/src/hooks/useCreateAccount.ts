import { useMutation, useQueryClient } from '@tanstack/react-query'
import { accountService } from '@infrastructure/api/services/account.service'
import type { CreateAccountInput } from '@infrastructure/api/services/account.service'

const ACCOUNTS_KEY = 'accounts'

export function useCreateAccount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountInput) => accountService.createForCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] })
    },
  })
}
