import { describe, it, expect } from 'vitest'
import { CustomerSchema } from '@domain/schemas'

describe('CustomerSchema', () => {
  const validCustomer = {
    id: 'cust-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    dateOfBirth: '1990-05-15',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  it('should validate a valid customer', () => {
    const result = CustomerSchema.safeParse(validCustomer)
    expect(result.success).toBe(true)
  })

  it('should reject empty id', () => {
    const result = CustomerSchema.safeParse({ ...validCustomer, id: '' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid email', () => {
    const result = CustomerSchema.safeParse({ ...validCustomer, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid dateOfBirth format', () => {
    const result = CustomerSchema.safeParse({ ...validCustomer, dateOfBirth: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('should reject invalid createdAt datetime', () => {
    const result = CustomerSchema.safeParse({ ...validCustomer, createdAt: 'not-datetime' })
    expect(result.success).toBe(false)
  })

  it('should reject missing required fields', () => {
    const result = CustomerSchema.safeParse({ id: 'cust-001' })
    expect(result.success).toBe(false)
  })
})
