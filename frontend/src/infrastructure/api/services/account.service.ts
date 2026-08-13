import { z } from 'zod'
import { apiClient } from '../client'
import { AccountSchema, TransactionSchema, createApiResponseSchema } from '@domain/schemas'
import type { AccountDto, TransactionDto, ApiResponseDto } from '@domain/schemas'

const AccountResponseSchema = createApiResponseSchema(AccountSchema)
const AccountListResponseSchema = createApiResponseSchema(z.array(AccountSchema))

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

export interface CreateAccountInput {
  customerNumber: number
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT'
  currency?: string
}

export const accountService = {
  async getByCustomerId(customerId: string): Promise<ApiResponseDto<AccountDto[]>> {
    const response = await apiClient.get(`/customers/${customerId}/accounts`)
    return AccountListResponseSchema.parse(response.data)
  },

  async getById(accountId: string): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.get(`/accounts/${accountId}`)
    return AccountResponseSchema.parse(response.data)
  },

  async getTransactions(
    accountId: string,
    params: { page?: number; size?: number } = {},
  ): Promise<TransactionPage> {
    const response = await apiClient.get(`/accounts/${accountId}/transactions`, { params })
    return TransactionPageSchema.parse(response.data)
  },

  async create(
    data: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.post('/accounts', data)
    return AccountResponseSchema.parse(response.data)
  },

  async createForCustomer(data: CreateAccountInput): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.post(`/accounts/add/${data.customerNumber}`, {
      type: data.type,
      currency: data.currency ?? 'USD',
    })
    return AccountResponseSchema.parse(response.data)
  },

  async update(
    id: string,
    data: Partial<Omit<AccountDto, 'id' | 'customerId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.put(`/accounts/${id}`, data)
    return AccountResponseSchema.parse(response.data)
  },
}
