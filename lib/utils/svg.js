export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

export const convertPointToSvgCoords = (canvas, { x, y }) => {
  const pt = canvas.createSVGPoint()
  pt.x = x
  pt.y = y
  const svgPoint = pt.matrixTransform(canvas.getScreenCTM().inverse())
  return {
    x: svgPoint.x,
    y: svgPoint.y
  }
}

export const exportCoordsFromEvent = event => {
  if (!event.touches) {
    return {
      clientX: event.clientX,
      clientY: event.clientY
    }
  }

  const touch = event.touches[0]

  return {
    clientX: touch.clientX,
    clientY: touch.clientY
  }
}

export const getMousePosition = (svg, event) => {
  const CTM = svg.getScreenCTM()
  const { clientX, clientY } = exportCoordsFromEvent(event)
  return {
    x: Math.floor((clientX - CTM.e) / CTM.a),
    y: Math.floor((clientY - CTM.f) / CTM.d)
  }
}

export const encodeTransformAttribute = ({ x, y }) => `translate(${x},${y})`

export const decodeTransformAttribute = attribute => {
  if (!attribute) {
    return
  }

  const translate = attribute
    .split(' ')
    .find(value => value.match(/translate\(.+\)/gm))

  if (!translate) {
    return
  }

  const coords = translate.match(/[0-9]*\.*[0-9]+/gm).map(v => parseFloat(v))

  return {
    x: coords[0],
    y: coords[1]
  }
}
