import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@utils/format-currency'

describe('formatCurrency', () => {
  it('should format USD by default', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('should format with specified currency', () => {
    const result = formatCurrency(1000, 'EUR', 'de-DE')
    expect(result).toContain('1.000')
  })

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('should handle negative amounts', () => {
    const result = formatCurrency(-500)
    expect(result).toContain('500.00')
  })
})
