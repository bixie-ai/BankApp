import { beforeEach, describe, expect, it, vi } from 'vitest'
import { customerService } from '@infrastructure/api/services/customer.service'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock('@infrastructure/api/client', () => ({
  apiClient: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    put: (...args: unknown[]) => mockPut(...args),
    delete: (...args: unknown[]) => mockDelete(...args),
  },
}))

const validCustomer = {
  firstName: 'John',
  lastName: 'Doe',
  customerNumber: 1000,
  status: 'ACTIVE',
  contactDetails: { emailId: 'john@example.com', homePhone: '555-1234' },
  customerAddress: { address1: '123 Main St' },
}

const paginatedResponse = {
  content: [validCustomer],
  totalElements: 1,
  totalPages: 1,
  number: 0,
  size: 10,
  first: true,
  last: true,
}

describe('customerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all customers with pagination params', async () => {
      mockGet.mockResolvedValue({ data: paginatedResponse })
      const result = await customerService.getAll({ page: 0, size: 10 })
      expect(mockGet).toHaveBeenCalledWith('/customers/all', { params: { page: 0, size: 10 } })
      expect(result.content).toEqual([validCustomer])
      expect(result.totalElements).toBe(1)
    })

    it('should pass search parameter when provided', async () => {
      mockGet.mockResolvedValue({ data: paginatedResponse })
      await customerService.getAll({ page: 0, size: 10, search: 'John' })
      expect(mockGet).toHaveBeenCalledWith('/customers/all', { params: { page: 0, size: 10, search: 'John' } })
    })
  })

  describe('getByCustomerNumber', () => {
    it('should fetch customer by customer number', async () => {
      mockGet.mockResolvedValue({ data: validCustomer })
      const result = await customerService.getByCustomerNumber(1000)
      expect(mockGet).toHaveBeenCalledWith('/customers/1000')
      expect(result.firstName).toBe('John')
    })
  })

  describe('create', () => {
    it('should post customer data to /customers/add', async () => {
      const input = {
        firstName: 'Jane',
        lastName: 'Doe',
        contactDetails: { emailId: 'jane@example.com', homePhone: '555-5678' },
      }
      mockPost.mockResolvedValue({ data: 'New Customer created successfully.' })
      const result = await customerService.create(input)
      expect(mockPost).toHaveBeenCalledWith('/customers/add', input)
      expect(result).toBe('New Customer created successfully.')
    })
  })

  describe('update', () => {
    it('should put customer data to /customers/:customerNumber', async () => {
      const input = {
        firstName: 'Updated',
        lastName: 'Doe',
        contactDetails: { emailId: 'updated@example.com' },
      }
      mockPut.mockResolvedValue({ data: 'Success: Customer updated.' })
      const result = await customerService.update(1000, input)
      expect(mockPut).toHaveBeenCalledWith('/customers/1000', input)
      expect(result).toBe('Success: Customer updated.')
    })
  })

  describe('delete', () => {
    it('should delete customer by customer number', async () => {
      mockDelete.mockResolvedValue({ data: undefined })
      await customerService.delete(1000)
      expect(mockDelete).toHaveBeenCalledWith('/customers/1000')
    })
  })
})
