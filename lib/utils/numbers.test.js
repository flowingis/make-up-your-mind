import { clamp } from './numbers'

describe('numbers', () => {
  describe('clamp', () => {
    test('it should clamp to min', () => {
      expect(clamp(-100, 0)).toBe(0)
    })

    test('it should clamp to max', () => {
      expect(clamp(100, 0, 50)).toBe(50)
    })

    test('it should return number if is in range', () => {
      expect(clamp(100, 0, 1000)).toBe(100)
    })

    test('it should return number if no max or min is provided', () => {
      expect(clamp(100)).toBe(100)
    })
  })
})
