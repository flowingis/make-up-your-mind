export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

export const getMousePosition = (svg, event) => {
  const CTM = svg.getScreenCTM()
  return {
    x: Math.floor((event.clientX - CTM.e) / CTM.a),
    y: Math.floor((event.clientY - CTM.f) / CTM.d)
  }
}

export const encodeTransformAttribute = ({ x, y }) => `translate(${x},${y})`

export const decodeTransformAttribute = attribute => {
  if (!attribute) {
    return
  }

  const translate = attribute
    .split(' ')
    .find(value => value.startsWith('translate'))

  if (!translate) {
    return
  }

  const coords = translate.match(/[0-9]+/gm).map(v => parseInt(v, 10))

  return {
    x: coords[0],
    y: coords[1]
  }
}
