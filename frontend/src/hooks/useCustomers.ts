import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService } from '@infrastructure/api/services/customer.service'
import type { CustomerSearchParams, CreateCustomerInput, UpdateCustomerInput } from '@infrastructure/api/services/customer.service'

const CUSTOMERS_KEY = 'customers'
const CUSTOMER_KEY = 'customer'

export function useCustomers(params: CustomerSearchParams = {}) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, params],
    queryFn: () => customerService.getAll(params),
  })
}

export function useCustomer(customerNumber: number | undefined) {
  return useQuery({
    queryKey: [CUSTOMER_KEY, customerNumber],
    queryFn: () => customerService.getByCustomerNumber(customerNumber!),
    enabled: customerNumber !== undefined,
  })
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomerInput) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
    },
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerNumber, data }: { customerNumber: number; data: UpdateCustomerInput }) =>
      customerService.update(customerNumber, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
      queryClient.invalidateQueries({ queryKey: [CUSTOMER_KEY] })
    },
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerNumber: number) => customerService.delete(customerNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
    },
  })
}
