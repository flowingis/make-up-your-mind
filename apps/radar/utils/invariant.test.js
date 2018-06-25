import invariant from './invariant'

describe('invariant', () => {
  test('should not throw when the condition is truthy', () => {
    const truthyValues = [1, true, [], {}]
    truthyValues.forEach(truthy => {
      expect(() => {
        invariant(truthy)
      }).not.toThrow()
    })
  })

  test('should throw when the condition is falsy', () => {
    const falsyValues = [undefined, null, 0, '', false, NaN]
    falsyValues.forEach(falsy => {
      expect(() => {
        invariant(falsy)
      }).toThrow()
    })
  })

  test('should throw a specific error when a second parameter is provided', () => {
    expect(() => {
      invariant(false, 'THIS_IS_A_MESSAGE')
    }).toThrow('THIS_IS_A_MESSAGE')
  })
})
