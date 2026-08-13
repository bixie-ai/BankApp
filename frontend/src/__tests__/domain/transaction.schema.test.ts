import { describe, it, expect } from 'vitest'
import { TransactionSchema } from '@domain/schemas'

describe('TransactionSchema', () => {
  const validTransaction = {
    id: 'txn-001',
    accountId: 'acc-001',
    type: 'DEPOSIT' as const,
    status: 'COMPLETED' as const,
    amount: 250.0,
    currency: 'USD',
    description: 'Monthly deposit',
    referenceNumber: 'REF-001',
    createdAt: '2024-01-15T10:30:00Z',
  }

  it('should validate a valid transaction', () => {
    const result = TransactionSchema.safeParse(validTransaction)
    expect(result.success).toBe(true)
  })

  it('should accept all valid transaction types', () => {
    for (const type of ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER']) {
      const result = TransactionSchema.safeParse({ ...validTransaction, type })
      expect(result.success).toBe(true)
    }
  })

  it('should accept all valid statuses', () => {
    for (const status of ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED']) {
      const result = TransactionSchema.safeParse({ ...validTransaction, status })
      expect(result.success).toBe(true)
    }
  })

  it('should reject zero amount', () => {
    const result = TransactionSchema.safeParse({ ...validTransaction, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('should reject negative amount', () => {
    const result = TransactionSchema.safeParse({ ...validTransaction, amount: -50 })
    expect(result.success).toBe(false)
  })

  it('should reject empty referenceNumber', () => {
    const result = TransactionSchema.safeParse({ ...validTransaction, referenceNumber: '' })
    expect(result.success).toBe(false)
  })

  it('should allow empty description', () => {
    const result = TransactionSchema.safeParse({ ...validTransaction, description: '' })
    expect(result.success).toBe(true)
  })
})
