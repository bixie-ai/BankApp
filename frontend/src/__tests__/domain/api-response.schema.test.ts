import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { createApiResponseSchema } from '@domain/schemas'

describe('ApiResponseSchema', () => {
  const StringResponseSchema = createApiResponseSchema(z.string())

  const validResponse = {
    success: true,
    data: 'hello',
    message: 'OK',
    timestamp: '2024-01-01T00:00:00Z',
  }

  it('should validate a valid API response', () => {
    const result = StringResponseSchema.safeParse(validResponse)
    expect(result.success).toBe(true)
  })

  it('should reject invalid data type', () => {
    const result = StringResponseSchema.safeParse({ ...validResponse, data: 123 })
    expect(result.success).toBe(false)
  })

  it('should reject invalid timestamp', () => {
    const result = StringResponseSchema.safeParse({ ...validResponse, timestamp: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('should reject non-boolean success', () => {
    const result = StringResponseSchema.safeParse({ ...validResponse, success: 'yes' })
    expect(result.success).toBe(false)
  })

  it('should work with complex data schemas', () => {
    const ObjectResponseSchema = createApiResponseSchema(
      z.object({ id: z.string(), value: z.number() }),
    )
    const result = ObjectResponseSchema.safeParse({
      success: true,
      data: { id: 'item-1', value: 42 },
      message: 'Found',
      timestamp: '2024-01-01T00:00:00Z',
    })
    expect(result.success).toBe(true)
  })
})
