import { describe, it, expect } from 'vitest'
import { CustomerSchema } from '@domain/schemas'

describe('CustomerSchema', () => {
  const validCustomer = {
    firstName: 'John',
    lastName: 'Doe',
    middleName: null,
    customerNumber: 1000,
    status: 'ACTIVE',
    contactDetails: {
      emailId: 'john.doe@example.com',
      homePhone: '+1234567890',
      workPhone: null,
    },
    customerAddress: {
      address1: '123 Main St',
      address2: null,
      city: 'Springfield',
      state: 'IL',
      zip: '62704',
      country: 'US',
    },
  }

  it('should validate a valid customer', () => {
    const result = CustomerSchema.safeParse(validCustomer)
    expect(result.success).toBe(true)
  })

  it('should allow null optional fields', () => {
    const result = CustomerSchema.safeParse({
      firstName: 'Jane',
      lastName: 'Smith',
      middleName: null,
      customerNumber: null,
      status: null,
      contactDetails: null,
      customerAddress: null,
    })
    expect(result.success).toBe(true)
  })

  it('should allow partial customer objects', () => {
    const result = CustomerSchema.safeParse({ firstName: 'Jane' })
    expect(result.success).toBe(true)
  })

  it('should validate nested contactDetails', () => {
    const result = CustomerSchema.safeParse({
      firstName: 'Test',
      contactDetails: { emailId: 'test@example.com' },
    })
    expect(result.success).toBe(true)
  })

  it('should validate nested customerAddress', () => {
    const result = CustomerSchema.safeParse({
      firstName: 'Test',
      customerAddress: { address1: '456 Elm St', city: 'Anywhere' },
    })
    expect(result.success).toBe(true)
  })
})
