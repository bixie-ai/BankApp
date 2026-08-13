import { describe, it, expect } from 'vitest'
import { AccountSchema } from '@domain/schemas'

describe('AccountSchema', () => {
  const validAccount = {
    id: 'acc-001',
    customerId: 'cust-001',
    accountNumber: '1234567890',
    type: 'CHECKING' as const,
    status: 'ACTIVE' as const,
    balance: 1500.5,
    currency: 'USD',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  it('should validate a valid account', () => {
    const result = AccountSchema.safeParse(validAccount)
    expect(result.success).toBe(true)
  })

  it('should accept all valid account types', () => {
    for (const type of ['CHECKING', 'SAVINGS', 'CREDIT']) {
      const result = AccountSchema.safeParse({ ...validAccount, type })
      expect(result.success).toBe(true)
    }
  })

  it('should reject invalid account type', () => {
    const result = AccountSchema.safeParse({ ...validAccount, type: 'INVALID' })
    expect(result.success).toBe(false)
  })

  it('should accept all valid statuses', () => {
    for (const status of ['ACTIVE', 'INACTIVE', 'CLOSED']) {
      const result = AccountSchema.safeParse({ ...validAccount, status })
      expect(result.success).toBe(true)
    }
  })

  it('should reject invalid status', () => {
    const result = AccountSchema.safeParse({ ...validAccount, status: 'INVALID' })
    expect(result.success).toBe(false)
  })

  it('should accept negative balance', () => {
    const result = AccountSchema.safeParse({ ...validAccount, balance: -100 })
    expect(result.success).toBe(true)
  })

  it('should reject non-numeric balance', () => {
    const result = AccountSchema.safeParse({ ...validAccount, balance: 'abc' })
    expect(result.success).toBe(false)
  })
})
