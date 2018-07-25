import {
  calculateX,
  calculateY,
  calculateWidth,
  calculateHeight
} from './marker'

describe('calculateX', () => {
  test('should work', () => {
    const canvasX = -50
    const legendWidth = 200
    const canvasWidth = 1000

    expect(calculateX({ canvasX, legendWidth, canvasWidth })).toBe(10)
  })
})

describe('calculateY', () => {
  test('should work', () => {
    const canvasY = -50
    const legendHeight = 200
    const canvasHeight = 1000

    expect(calculateY({ canvasY, legendHeight, canvasHeight })).toBe(10)
  })
})

describe('calculateWidth', () => {
  test('should work', () => {
    const canvasWidth = 2000
    const legendWidth = 200
    const windowWidth = 1000

    expect(calculateWidth({ canvasWidth, legendWidth, windowWidth })).toBe(100)
  })
})

describe('calculateHeight', () => {
  test('should work', () => {
    const canvasHeight = 2000
    const legendHeight = 200
    const windowHeight = 1000

    expect(calculateHeight({ canvasHeight, legendHeight, windowHeight })).toBe(
      100
    )
  })
})
