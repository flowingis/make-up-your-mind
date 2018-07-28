import normalizeDraggablePosition from './normalizeDraggablePosition'

describe('normalizeDraggablePosition', () => {
  test('it should clamp minimal values', () => {
    const { x, y } = normalizeDraggablePosition({
      x: -100,
      y: -100
    })

    expect(x).toBe(0)
    expect(y).toBe(0)
  })

  test('it should clamp max x value', () => {
    const { x } = normalizeDraggablePosition({
      x: 1000,
      nodeWidth: 100,
      parentWidth: 1000
    })

    expect(x).toBe(900)
  })

  test('it should clamp max y value', () => {
    const { y } = normalizeDraggablePosition({
      y: 1000,
      nodeHeight: 100,
      parentHeight: 1000
    })

    expect(y).toBe(900)
  })
})
