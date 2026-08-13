import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerService } from '@infrastructure/api/services/customer.service'
import type { CustomerSearchParams, CreateCustomerInput, UpdateCustomerInput } from '@infrastructure/api/services/customer.service'

const CUSTOMERS_KEY = 'customers'
const CUSTOMER_KEY = 'customer'

/**
 * Fetches a paginated and filterable list of customers.
 * The query is keyed by the search params, so changing filters
 * or pagination triggers an automatic refetch.
 *
 * @returns A React Query result containing the customer list, loading state, and error state.
 */
export function useCustomers(params: CustomerSearchParams = {}) {
  return useQuery({
    queryKey: [CUSTOMERS_KEY, params],
    queryFn: () => customerService.getAll(params),
  })
}

/**
 * Fetches a single customer by their customer number.
 * The query is disabled until a valid customerNumber is provided,
 * preventing unnecessary API calls when the identifier is not yet available.
 *
 * @returns A React Query result containing the customer data, loading state, and error state.
 */
export function useCustomer(customerNumber: number | undefined) {
  return useQuery({
    queryKey: [CUSTOMER_KEY, customerNumber],
    queryFn: () => customerService.getByCustomerNumber(customerNumber!),
    enabled: customerNumber !== undefined,
  })
}

/**
 * Provides a mutation to create a new customer.
 * On success, invalidates the customers list cache so that
 * displayed customer lists include the newly created entry.
 *
 * @returns A React Query mutation object with a mutate function accepting CreateCustomerInput.
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomerInput) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
    },
  })
}

/**
 * Provides a mutation to update an existing customer's information.
 * On success, invalidates both the customers list and individual customer caches
 * to ensure all views reflect the updated data.
 *
 * @returns A React Query mutation object with a mutate function accepting customerNumber and UpdateCustomerInput.
 */
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

/**
 * Provides a mutation to delete a customer by their customer number.
 * On success, invalidates the customers list cache so the deleted
 * customer is removed from any displayed lists.
 *
 * @returns A React Query mutation object with a mutate function accepting a customerNumber.
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (customerNumber: number) => customerService.delete(customerNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
    },
  })
}
