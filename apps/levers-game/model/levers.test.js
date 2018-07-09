import { factory } from './levers'

describe('levers model', () => {
  test('should return an immutable array', () => {
    const levers = factory([])
    expect(() => {
      levers.get().push(1)
    }).toThrow()
  })

  test('should replace the position of the right element', () => {
    const VALUES = ['a', 'b', 'c']
    const COORDS = [{ y: 0 }, { y: 50 }, { y: 100 }]
    const levers = factory(VALUES, COORDS)

    const data = levers.changePosition('b', { y: 110 }).get()

    expect(data).toEqual(['a', 'c', 'b'])
  })
})
