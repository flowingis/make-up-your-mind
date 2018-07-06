import { decodeTransformAttribute } from './svg'

describe('svg utils', () => {
  describe('decodeTransformAttribute', () => {
    test('return a falsy value when no translate value is provided', () => {
      expect(decodeTransformAttribute()).toBeFalsy()
      expect(decodeTransformAttribute('rotate(10)')).toBeFalsy()
    })

    test('return coordinates from translate value', () => {
      expect(decodeTransformAttribute('translate(1,2) rotate(10)')).toEqual({
        x: 1,
        y: 2
      })
    })

    test('return coordinates from translate value, also with decimal values', () => {
      expect(
        decodeTransformAttribute('translate(50.5,68.967) rotate(10)')
      ).toEqual({
        x: 50.5,
        y: 68.967
      })
    })
  })
})
