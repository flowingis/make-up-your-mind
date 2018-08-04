const calculateWidth = ({ legendWidth, windowWidth, canvasWidth }) => {
  const ratio = canvasWidth / windowWidth
  return Math.floor(legendWidth / ratio)
}

const calculateHeight = ({ legendHeight, canvasHeight, windowHeight }) => {
  const ratio = canvasHeight / windowHeight
  return Math.floor(legendHeight / ratio)
}

const calculateX = ({ canvasX, legendWidth, canvasWidth }) => {
  const ratio = canvasX / canvasWidth
  return -1 * Math.floor(legendWidth * ratio)
}

const calculateY = ({ canvasY, legendHeight, canvasHeight }) => {
  const ratio = canvasY / canvasHeight
  return -1 * Math.floor(legendHeight * ratio)
}

export default ({
  legendWidth,
  legendHeight,
  windowWidth,
  windowHeight,
  canvasWidth,
  canvasHeight,
  canvasX,
  canvasY
}) => {
  const width = calculateWidth({
    legendWidth,
    windowWidth,
    canvasWidth
  })

  const height = calculateHeight({
    legendHeight,
    windowHeight,
    canvasHeight
  })

  const x = calculateX({
    canvasX,
    legendWidth,
    canvasWidth
  })

  const y = calculateY({
    canvasY,
    legendHeight,
    canvasHeight
  })

  return {
    width,
    height,
    x,
    y
  }
}
