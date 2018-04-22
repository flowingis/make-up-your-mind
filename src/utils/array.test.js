import { newIndexedArray } from './array'

describe('array utils', () => {
  describe('newIndexedArray', () => {
    test('should fill an array with the right index', () => {
      expect(newIndexedArray(0)).toEqual([])
      expect(newIndexedArray(1)).toEqual([0])
      expect(newIndexedArray(2)).toEqual([0, 1])
      expect(newIndexedArray(3)).toEqual([0, 1, 2])

      const array = newIndexedArray(100)
      expect(array.length).toBe(100)
      array.forEach((value, index) => {
        expect(value).toBe(index)
      })
    })

    test('should manage empty data', () => {
      expect(newIndexedArray(0)).toEqual([])
      expect(newIndexedArray(undefined)).toEqual([])
      expect(newIndexedArray(null)).toEqual([])
    })
  })
})
