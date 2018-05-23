import { createPathAttribute } from './svg'

const POINTS = [
  {
    x: 0,
    y: 0
  },
  {
    x: 1,
    y: 0
  },
  {
    x: 1,
    y: 1
  }
]

describe('svg utils', () => {
  describe('createPathAttribute', () => {
    test('should manage empty data', () => {
      const EXPECTATION = 'M0 0'
      expect(createPathAttribute()).toEqual(EXPECTATION)
      expect(createPathAttribute([])).toEqual(EXPECTATION)
    })

    test('should start with a "move to', () => {
      expect(
        createPathAttribute(POINTS)
          .toLowerCase()
          .startsWith('m')
      ).toBe(true)
    })

    test('should use "line to" to move to point to point', () => {
      const result = createPathAttribute(POINTS)
      const count = (result.toLowerCase().match(/l/g) || []).length
      expect(count).toBe(POINTS.length - 1)
    })

    test('should create a closed line', () => {
      expect(
        createPathAttribute(POINTS)
          .toLowerCase()
          .endsWith('z')
      ).toBe(true)
    })
  })
})
