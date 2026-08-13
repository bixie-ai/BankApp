import { apiClient } from '../client'
import type { CustomerDto } from '@domain/schemas'

/** Generic paginated response envelope returned by list endpoints. */
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

/** Query parameters accepted by the customer listing endpoint. */
export interface CustomerSearchParams {
  page?: number
  size?: number
  search?: string
}

/** Input payload for creating a new customer record. */
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

/** Input payload for updating an existing customer (same shape as create). */
export type UpdateCustomerInput = CreateCustomerInput

/**
 * Service layer wrapping all customer-related API operations.
 *
 * Provides CRUD methods for customer records and supports paginated
 * listing with optional text search.
 */
export const customerService = {
  /**
   * Retrieves a paginated list of all customers, optionally filtered by search text.
   * @param params - Pagination and search parameters.
   * @returns A paginated response containing customer DTOs.
   */
  async getAll(params: CustomerSearchParams = {}): Promise<PaginatedResponse<CustomerDto>> {
    const response = await apiClient.get('/customers/all', { params })
    return response.data
  },

  /**
   * Fetches a single customer by their unique customer number.
   * @param customerNumber - The numeric customer identifier.
   * @returns The customer DTO.
   */
  async getByCustomerNumber(customerNumber: number): Promise<CustomerDto> {
    const response = await apiClient.get(`/customers/${customerNumber}`)
    return response.data
  },

  /**
   * Creates a new customer record.
   * @param data - The customer information to persist.
   * @returns A server-generated confirmation message or identifier.
   */
  async create(data: CreateCustomerInput): Promise<string> {
    const response = await apiClient.post('/customers/add', data)
    return response.data
  },

  /**
   * Updates an existing customer record identified by customer number.
   * @param customerNumber - The numeric customer identifier to update.
   * @param data - The full updated customer payload.
   * @returns A server-generated confirmation message or identifier.
   */
  async update(customerNumber: number, data: UpdateCustomerInput): Promise<string> {
    const response = await apiClient.put(`/customers/${customerNumber}`, data)
    return response.data
  },

  /**
   * Permanently deletes a customer record.
   * @param customerNumber - The numeric customer identifier to delete.
   */
  async delete(customerNumber: number): Promise<void> {
    await apiClient.delete(`/customers/${customerNumber}`)
  },
}
