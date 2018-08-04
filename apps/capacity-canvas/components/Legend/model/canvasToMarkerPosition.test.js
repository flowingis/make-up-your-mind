import canvasToMarkerPosition from './canvasToMarkerPosition'

describe('canvasToMarkerPosition', () => {
  test('should calculate the right x coordinate', () => {
    const canvasX = -50
    const legendWidth = 200
    const canvasWidth = 1000

    expect(
      canvasToMarkerPosition({ canvasX, legendWidth, canvasWidth }).x
    ).toBe(10)
  })

  test('should calculate the right y coordinate', () => {
    const canvasY = -50
    const legendHeight = 200
    const canvasHeight = 1000

    expect(
      canvasToMarkerPosition({ canvasY, legendHeight, canvasHeight }).y
    ).toBe(10)
  })

  test('should calculate the right width', () => {
    const canvasWidth = 2000
    const legendWidth = 200
    const windowWidth = 1000

    expect(
      canvasToMarkerPosition({ canvasWidth, legendWidth, windowWidth }).width
    ).toBe(100)
  })

  test('should calculate the right height', () => {
    const canvasHeight = 2000
    const legendHeight = 200
    const windowHeight = 1000

    expect(
      canvasToMarkerPosition({ canvasHeight, legendHeight, windowHeight })
        .height
    ).toBe(100)
  })
})
