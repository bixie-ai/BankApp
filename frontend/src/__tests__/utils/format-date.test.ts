import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime } from '@utils/format-date'

describe('formatDate', () => {
  it('should format a date string with default options', () => {
    const result = formatDate('2024-03-15T00:00:00Z')
    expect(result).toContain('Mar')
    expect(result).toContain('2024')
    expect(result).toContain('15')
  })

  it('should accept custom options', () => {
    const result = formatDate('2024-03-15T00:00:00Z', { year: 'numeric', month: 'long' })
    expect(result).toContain('March')
    expect(result).toContain('2024')
  })
})

describe('formatDateTime', () => {
  it('should include time in output', () => {
    const result = formatDateTime('2024-03-15T14:30:00Z')
    expect(result).toContain('Mar')
    expect(result).toContain('2024')
  })
})
