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
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-1234',
  dateOfBirth: '1990-01-15',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const validApiResponse = {
  success: true,
  data: validCustomer,
  message: 'OK',
  timestamp: '2024-01-01T00:00:00Z',
}

const validListResponse = {
  success: true,
  data: [validCustomer],
  message: 'OK',
  timestamp: '2024-01-01T00:00:00Z',
}

describe('customerService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all customers and validate response', async () => {
      mockGet.mockResolvedValue({ data: validListResponse })
      const result = await customerService.getAll()
      expect(mockGet).toHaveBeenCalledWith('/customers')
      expect(result.data).toEqual([validCustomer])
    })

    it('should throw on invalid response schema', async () => {
      mockGet.mockResolvedValue({ data: { success: true, data: [{ invalid: true }] } })
      await expect(customerService.getAll()).rejects.toThrow()
    })
  })

  describe('getById', () => {
    it('should fetch customer by id and validate response', async () => {
      mockGet.mockResolvedValue({ data: validApiResponse })
      const result = await customerService.getById('1')
      expect(mockGet).toHaveBeenCalledWith('/customers/1')
      expect(result.data).toEqual(validCustomer)
    })

    it('should throw on invalid response schema', async () => {
      mockGet.mockResolvedValue({ data: { success: true, data: { id: '' } } })
      await expect(customerService.getById('1')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should post customer data and validate response', async () => {
      const input = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        phone: '555-5678',
        dateOfBirth: '1992-05-20',
      }
      mockPost.mockResolvedValue({ data: validApiResponse })
      const result = await customerService.create(input)
      expect(mockPost).toHaveBeenCalledWith('/customers', input)
      expect(result.success).toBe(true)
    })
  })

  describe('update', () => {
    it('should put customer data and validate response', async () => {
      const input = { firstName: 'Updated' }
      mockPut.mockResolvedValue({ data: validApiResponse })
      const result = await customerService.update('1', input)
      expect(mockPut).toHaveBeenCalledWith('/customers/1', input)
      expect(result.success).toBe(true)
    })
  })

  describe('delete', () => {
    it('should delete customer and validate response', async () => {
      mockDelete.mockResolvedValue({ data: validApiResponse })
      const result = await customerService.delete('1')
      expect(mockDelete).toHaveBeenCalledWith('/customers/1')
      expect(result.success).toBe(true)
    })
  })
})
