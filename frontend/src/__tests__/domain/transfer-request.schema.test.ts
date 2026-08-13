import { describe, it, expect } from 'vitest'
import { TransferRequestSchema } from '@domain/schemas'

describe('TransferRequestSchema', () => {
  const validTransfer = {
    fromAccountId: 'acc-001',
    toAccountId: 'acc-002',
    amount: 100.0,
    currency: 'USD',
    description: 'Rent payment',
  }

  it('should validate a valid transfer request', () => {
    const result = TransferRequestSchema.safeParse(validTransfer)
    expect(result.success).toBe(true)
  })

  it('should reject zero amount', () => {
    const result = TransferRequestSchema.safeParse({ ...validTransfer, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('should reject negative amount', () => {
    const result = TransferRequestSchema.safeParse({ ...validTransfer, amount: -10 })
    expect(result.success).toBe(false)
  })

  it('should reject empty fromAccountId', () => {
    const result = TransferRequestSchema.safeParse({ ...validTransfer, fromAccountId: '' })
    expect(result.success).toBe(false)
  })

  it('should reject empty toAccountId', () => {
    const result = TransferRequestSchema.safeParse({ ...validTransfer, toAccountId: '' })
    expect(result.success).toBe(false)
  })

  it('should allow empty description', () => {
    const result = TransferRequestSchema.safeParse({ ...validTransfer, description: '' })
    expect(result.success).toBe(true)
  })

  it('should reject missing fields', () => {
    const result = TransferRequestSchema.safeParse({ fromAccountId: 'acc-001' })
    expect(result.success).toBe(false)
  })
})
