import { z } from 'zod'
import { apiClient } from '../client'
import { AccountSchema, createApiResponseSchema } from '@domain/schemas'
import type { AccountDto, ApiResponseDto } from '@domain/schemas'

const AccountResponseSchema = createApiResponseSchema(AccountSchema)
const AccountListResponseSchema = createApiResponseSchema(z.array(AccountSchema))

export const accountService = {
  async getByCustomerId(customerId: string): Promise<ApiResponseDto<AccountDto[]>> {
    const response = await apiClient.get(`/customers/${customerId}/accounts`)
    return AccountListResponseSchema.parse(response.data)
  },

  async getById(accountId: string): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.get(`/accounts/${accountId}`)
    return AccountResponseSchema.parse(response.data)
  },

  async create(
    data: Omit<AccountDto, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponseDto<AccountDto>> {
    const response = await apiClient.post('/accounts', data)
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
