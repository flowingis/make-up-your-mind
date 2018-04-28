import {
  gradsToRadians,
  rotatePoint,
  translatePoint,
  scalePoint
} from './chart'

describe('chart utils', () => {
  describe('gradsToRadians', () => {
    test('should convert grads to radians', () => {
      expect(gradsToRadians(0)).toBe(0)
      expect(gradsToRadians(45)).toBeCloseTo(Math.PI / 4)
      expect(gradsToRadians(90)).toBeCloseTo(Math.PI / 2)
      expect(gradsToRadians(180)).toBeCloseTo(Math.PI)
      expect(gradsToRadians(360)).toBeCloseTo(2 * Math.PI)
      expect(gradsToRadians(-180)).toBeCloseTo(-Math.PI)
      expect(gradsToRadians(-90)).toBeCloseTo(-Math.PI / 2)
    })
  })

  describe('rotatePoint', () => {
    test('should rotate points', () => {
      const POINT = { x: 1, y: 0 }

      let result = rotatePoint(90)(POINT)
      expect(result.x).toBeCloseTo(0)
      expect(result.y).toBeCloseTo(-1)

      result = rotatePoint(180)(POINT)
      expect(result.x).toBeCloseTo(-1)
      expect(result.y).toBeCloseTo(0)

      result = rotatePoint(270)(POINT)
      expect(result.x).toBeCloseTo(0)
      expect(result.y).toBeCloseTo(1)

      result = rotatePoint(360)(POINT)
      expect(result.x).toBeCloseTo(1)
      expect(result.y).toBeCloseTo(0)
    })
  })

  describe('translatePoint', () => {
    test('should correctly translate a point', () => {
      const POINT = { x: 2, y: 1 }
      expect(translatePoint(-2, -1)(POINT)).toEqual({ x: 0, y: 0 })
    })
  })

  describe('scalePoint', () => {
    test('should correctly translate a point', () => {
      const POINT = { x: 2, y: 1 }
      expect(scalePoint(5)(POINT)).toEqual({ x: 10, y: 5 })
    })
  })
})
