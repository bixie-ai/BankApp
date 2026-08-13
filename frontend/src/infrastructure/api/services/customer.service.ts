import { apiClient } from '../client'
import type { CustomerDto } from '@domain/schemas'

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface CustomerSearchParams {
  page?: number
  size?: number
  search?: string
}

export type CreateCustomerInput = {
  firstName: string
  lastName: string
  middleName?: string
  customerNumber?: number
  status?: string
  contactDetails: {
    emailId: string
    homePhone?: string
    workPhone?: string
  }
  customerAddress?: {
    address1?: string
    address2?: string
    city?: string
    state?: string
    zip?: string
    country?: string
  }
}

export type UpdateCustomerInput = CreateCustomerInput

export const customerService = {
  async getAll(params: CustomerSearchParams = {}): Promise<PaginatedResponse<CustomerDto>> {
    const response = await apiClient.get('/customers/all', { params })
    return response.data
  },

  async getByCustomerNumber(customerNumber: number): Promise<CustomerDto> {
    const response = await apiClient.get(`/customers/${customerNumber}`)
    return response.data
  },

  async create(data: CreateCustomerInput): Promise<string> {
    const response = await apiClient.post('/customers/add', data)
    return response.data
  },

  async update(customerNumber: number, data: UpdateCustomerInput): Promise<string> {
    const response = await apiClient.put(`/customers/${customerNumber}`, data)
    return response.data
  },

  async delete(customerNumber: number): Promise<void> {
    await apiClient.delete(`/customers/${customerNumber}`)
  },
}
