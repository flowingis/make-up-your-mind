import dataParser from './dataParser'
const { encode, decode } = dataParser

describe('dataParser', () => {
  describe('encode', () => {
    test('should manage invalid or empty values', () => {
      expect(encode('')).toEqual('')
      expect(encode('')).toEqual('')
      expect(encode({})).toEqual('')
      expect(encode([])).toEqual('')
    })
    test('should generate a valid string from array', () => {
      expect(
        encode([
          {
            label: 'first',
            value: 1
          },
          {
            label: 'second',
            value: 2
          }
        ])
      ).toBe('first=1,second=2')
    })
    test('should be inverse to decode with valid data', () => {
      const data = [
        {
          label: 'first',
          value: 1
        },
        {
          label: 'second',
          value: 2
        }
      ]
      expect(decode(encode(data))).toEqual(data)
    })
  })
  describe('decode', () => {
    test('should manage empty values', () => {
      expect(decode('')).toEqual([])
    })
    test('should generate array of pairs with label and value', () => {
      expect(decode('first=1,second=2')).toEqual([
        {
          label: 'first',
          value: 1
        },
        {
          label: 'second',
          value: 2
        }
      ])
    })
    test('should manage empty labels', () => {
      expect(decode('=1')).toEqual([
        {
          label: '',
          value: 1
        }
      ])
    })
    test('should manage non numeric values, setting them to zero', () => {
      expect(decode('first=one')).toEqual([
        {
          label: 'first',
          value: 0
        }
      ])
    })
    test('values should be from 0 to 100', () => {
      expect(decode('first=-99,second=150')).toEqual([
        {
          label: 'first',
          value: 0
        },
        {
          label: 'second',
          value: 100
        }
      ])
    })
    test('should be inverse to encode with valid data', () => {
      const data = 'first=1,second=2'
      expect(encode(decode(data))).toEqual(data)
    })
  })
})
