import { z } from 'zod'
import { apiClient } from '../client'
import { CustomerSchema, createApiResponseSchema } from '@domain/schemas'
import type { CustomerDto, ApiResponseDto } from '@domain/schemas'

const CustomerResponseSchema = createApiResponseSchema(CustomerSchema)
const CustomerListResponseSchema = createApiResponseSchema(z.array(CustomerSchema))

export const customerService = {
  async getAll(): Promise<ApiResponseDto<CustomerDto[]>> {
    const response = await apiClient.get('/customers')
    return CustomerListResponseSchema.parse(response.data)
  },

  async getById(id: string): Promise<ApiResponseDto<CustomerDto>> {
    const response = await apiClient.get(`/customers/${id}`)
    return CustomerResponseSchema.parse(response.data)
  },

  async create(
    data: Omit<CustomerDto, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ApiResponseDto<CustomerDto>> {
    const response = await apiClient.post('/customers', data)
    return CustomerResponseSchema.parse(response.data)
  },

  async update(
    id: string,
    data: Partial<Omit<CustomerDto, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ApiResponseDto<CustomerDto>> {
    const response = await apiClient.put(`/customers/${id}`, data)
    return CustomerResponseSchema.parse(response.data)
  },

  async delete(id: string): Promise<ApiResponseDto<CustomerDto>> {
    const response = await apiClient.delete(`/customers/${id}`)
    return CustomerResponseSchema.parse(response.data)
  },
}
