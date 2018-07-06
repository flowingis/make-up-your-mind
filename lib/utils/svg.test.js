import { decodeTransformAttribute } from './svg'

describe('svg utils', () => {
  describe('decodeTransformAttribute', () => {
    test('return a falsy value when no translate value is provided', () => {
      expect(decodeTransformAttribute()).toBeFalsy()
      expect(decodeTransformAttribute('rotate(10)')).toBeFalsy()
    })

    test('return coordinates from translate value', () => {
      expect(decodeTransformAttribute('translate(1,2)')).toEqual({
        x: 1,
        y: 2
      })
    })
  })
})
