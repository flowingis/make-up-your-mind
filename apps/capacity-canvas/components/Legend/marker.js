import getMarkerPostionData from './model/getMarkerPositionData'

export default (legend, observedElement) => {
  const { innerWidth, innerHeight } = window
  const legendDOMRect = legend.getBoundingClientRect()
  const canvasDOMRect = observedElement.getBoundingClientRect()

  const legendWidth = legendDOMRect.width
  const legendHeight = legendDOMRect.height
  const canvasWidth = canvasDOMRect.width
  const canvasHeight = canvasDOMRect.height

  const positionData = getMarkerPostionData({
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

  div.style.width = `${positionData.width}px`
  div.style.height = `${positionData.height}px`
  div.style.left = `${positionData.x}px`
  div.style.top = `${positionData.y}px`

  return div
}
