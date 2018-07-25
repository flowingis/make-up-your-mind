export const calculateWidth = ({ legendWidth, windowWidth, canvasWidth }) => {
  const ratio = canvasWidth / windowWidth
  return Math.floor(legendWidth / ratio)
}

export const calculateHeight = ({
  legendHeight,
  canvasHeight,
  windowHeight
}) => {
  const ratio = canvasHeight / windowHeight
  return Math.floor(legendHeight / ratio)
}

export const calculateX = ({ canvasX, legendWidth, canvasWidth }) => {
  const ratio = canvasX / canvasWidth
  return -1 * Math.floor(legendWidth * ratio)
}

export const calculateY = ({ canvasY, legendHeight, canvasHeight }) => {
  const ratio = canvasY / canvasHeight
  return Math.floor(legendHeight * ratio)
}

const getDimensions = ({
  legendWidth,
  legendHeight,
  windowWidth,
  windowHeight,
  canvasWidth,
  canvasHeight,
  canvasX,
  canvasY
}) => {
  return {
    width: calculateWidth({
      legendWidth,
      windowWidth,
      canvasWidth
    }),
    height: calculateHeight({
      legendHeight,
      windowHeight,
      canvasHeight
    }),
    x: calculateX({
      canvasX,
      legendWidth,
      canvasWidth
    }),
    y: calculateY({
      canvasY,
      legendHeight,
      canvasHeight
    })
  }
}

export default (legend, observedElement) => {
  const { innerWidth, innerHeight } = window
  const legendDOMRect = legend.getBoundingClientRect()
  const canvasDOMRect = observedElement.getBoundingClientRect()

  const legendWidth = legendDOMRect.width
  const legendHeight = legendDOMRect.height
  const canvasWidth = canvasDOMRect.width
  const canvasHeight = canvasDOMRect.height

  const dimensions = getDimensions({
    legendHeight,
    legendWidth,
    canvasHeight,
    canvasWidth,
    windowHeight: innerHeight,
    windowWidth: innerWidth,
    canvasX: canvasDOMRect.left,
    canvasY: canvasDOMRect.top
  })

  const div = document.createElement('div')

  div.classList.add('marker')
  div.style.width = `${dimensions.width}px`
  div.style.height = `${dimensions.height}px`
  div.style.left = `${dimensions.x}px`
  div.style.top = `${dimensions.y}px`

  return div
}
