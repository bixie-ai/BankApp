import { beforeEach, describe, expect, it, vi } from 'vitest'
import { accountService } from '@infrastructure/api/services/account.service'

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()

vi.mock('@infrastructure/api/client', () => ({
  apiClient: {
    get: (...args: unknown[]) => mockGet(...args),
    post: (...args: unknown[]) => mockPost(...args),
    put: (...args: unknown[]) => mockPut(...args),
  },
}))

const validAccount = {
  id: 'acc-1',
  customerId: 'cust-1',
  accountNumber: '1234567890',
  type: 'CHECKING' as const,
  status: 'ACTIVE' as const,
  balance: 1000.5,
  currency: 'USD',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const validApiResponse = {
  success: true,
  data: validAccount,
  message: 'OK',
  timestamp: '2024-01-01T00:00:00Z',
}

const validListResponse = {
  success: true,
  data: [validAccount],
  message: 'OK',
  timestamp: '2024-01-01T00:00:00Z',
}

describe('accountService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getByCustomerId', () => {
    it('should fetch accounts by customer id and validate response', async () => {
      mockGet.mockResolvedValue({ data: validListResponse })
      const result = await accountService.getByCustomerId('cust-1')
      expect(mockGet).toHaveBeenCalledWith('/customers/cust-1/accounts')
      expect(result.data).toEqual([validAccount])
    })

    it('should throw on invalid response schema', async () => {
      mockGet.mockResolvedValue({ data: { success: true, data: [{ id: '' }] } })
      await expect(accountService.getByCustomerId('cust-1')).rejects.toThrow()
    })
  })

  describe('getById', () => {
    it('should fetch account by id and validate response', async () => {
      mockGet.mockResolvedValue({ data: validApiResponse })
      const result = await accountService.getById('acc-1')
      expect(mockGet).toHaveBeenCalledWith('/accounts/acc-1')
      expect(result.data).toEqual(validAccount)
    })

    it('should throw on invalid response schema', async () => {
      mockGet.mockResolvedValue({
        data: { success: true, data: { id: 'x', type: 'INVALID' } },
      })
      await expect(accountService.getById('acc-1')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('should post account data and validate response', async () => {
      const input = {
        customerId: 'cust-1',
        accountNumber: '9876543210',
        type: 'SAVINGS' as const,
        status: 'ACTIVE' as const,
        balance: 0,
        currency: 'USD',
      }
      mockPost.mockResolvedValue({ data: validApiResponse })
      const result = await accountService.create(input)
      expect(mockPost).toHaveBeenCalledWith('/accounts', input)
      expect(result.success).toBe(true)
    })
  })

  describe('update', () => {
    it('should put account data and validate response', async () => {
      const input = { balance: 2000 }
      mockPut.mockResolvedValue({ data: validApiResponse })
      const result = await accountService.update('acc-1', input)
      expect(mockPut).toHaveBeenCalledWith('/accounts/acc-1', input)
      expect(result.success).toBe(true)
    })
  })
})
