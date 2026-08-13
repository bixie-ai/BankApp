import { z } from 'zod'
import { apiClient } from '../client'
import { AccountSchema, TransactionSchema, createApiResponseSchema } from '@domain/schemas'
import type { AccountDto, TransactionDto, ApiResponseDto } from '@domain/schemas'

const AccountResponseSchema = createApiResponseSchema(AccountSchema)
const AccountListResponseSchema = createApiResponseSchema(z.array(AccountSchema))

/** Paginated response shape for transaction listing endpoints. */
export interface TransactionPage {
  content: TransactionDto[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

const TransactionPageSchema = z.object({
  content: z.array(TransactionSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  number: z.number(),
  size: z.number(),
  first: z.boolean(),
  last: z.boolean(),
})

/** Input payload for creating a new account linked to a customer number. */
export interface CreateAccountInput {
  customerNumber: number
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
  currency?: string
}

/**
 * Service layer wrapping all account-related API operations.
 *
 * Every method validates the response payload against a Zod schema at runtime,
 * ensuring the frontend never operates on malformed data from the backend.
 */
export const accountService = {
  /**
   * Retrieves all accounts belonging to a specific customer.
   * @param customerId - The customer identifier to look up accounts for.
   * @returns A validated API response containing an array of account DTOs.
   */
  async getByCustomerId(customerId: string): Promise<ApiResponseDto<AccountDto[]>> {
    const response = await apiClient.get(`/customers/${customerId}/accounts`)
    return AccountListResponseSchema.parse(response.data)
  },

  /**
   * Fetches a single account by its unique identifier.
   * @param accountId - The account identifier.
   * @returns A validated API response containing the account DTO.
   */
  async getById(accountId: string): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.get(`/accounts/${accountId}`)
    return AccountResponseSchema.parse(response.data)
  },

  /**
   * Retrieves a paginated list of transactions for a given account.
   * @param accountId - The account whose transactions to fetch.
   * @param params - Optional pagination parameters (page index and page size).
   * @returns A paginated transaction response validated against the schema.
   */
  async getTransactions(
    accountId: string,
    params: { page?: number; size?: number } = {},
  ): Promise<TransactionPage> {
    const response = await apiClient.get(`/accounts/${accountId}/transactions`, { params })
    return TransactionPageSchema.parse(response.data)
  },

  /**
   * Creates a new account with the provided data.
   * @param data - Account fields excluding server-generated ones (id, timestamps).
   * @returns A validated API response containing the newly created account.
   */
  async create(
    data: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.post('/accounts', data)
    return AccountResponseSchema.parse(response.data)
  },

  /**
   * Creates a new account linked to an existing customer number.
   * Defaults to USD currency when none is specified.
   * @param data - Customer number, account type, and optional currency.
   * @returns A validated API response containing the newly created account.
   */
  async createForCustomer(data: CreateAccountInput): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.post(`/accounts/add/${data.customerNumber}`, {
      type: data.type,
      currency: data.currency ?? 'USD',
    })
    return AccountResponseSchema.parse(response.data)
  },

  /**
   * Partially updates an existing account.
   * @param id - The account identifier to update.
   * @param data - A partial set of mutable account fields.
   * @returns A validated API response containing the updated account.
   */
  async update(
    id: string,
    data: Partial<Omit<AccountDto, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.put(`/accounts/${id}`, data)
    return AccountResponseSchema.parse(response.data)
  },
}
