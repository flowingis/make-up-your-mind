const calculateX = ({ markerX, legendWidth, canvasWidth }) => {
  const ratio = markerX / legendWidth
  return -1 * Math.floor(canvasWidth * ratio)
}

const calculateY = ({ markerY, legendHeight, canvasHeight }) => {
  const ratio = markerY / legendHeight
  return -1 * Math.floor(canvasHeight * ratio)
}

export default ({
  legendWidth,
  legendHeight,
  canvasWidth,
  canvasHeight,
  markerX,
  markerY
}) => {
  const x = calculateX({
    markerX,
    legendWidth,
    canvasWidth
  })

  const y = calculateY({
    markerY,
    legendHeight,
    canvasHeight
  })

  return {
    x,
    y
  }
}
