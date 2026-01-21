import { describe, it, expect } from 'vitest'

describe('Example tests', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should check array operations', () => {
    const arr = [1, 2, 3]
    expect(arr).toHaveLength(3)
    expect(arr).toContain(2)
  })

  it('should check string operations', () => {
    const str = 'PT Tracker'
    expect(str).toMatch(/PT/)
    expect(str.toLowerCase()).toBe('pt tracker')
  })
})
