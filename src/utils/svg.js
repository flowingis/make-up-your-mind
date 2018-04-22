export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

export const createPathAttribute = (points = []) => {
  if (points.length === 0) {
    return 'M0 0'
  }

  let dPathAttribute = points.reduce((accumulator, point, index) => {
    return (
      accumulator + (index === 0 ? 'M' : 'L') + point.x + ' ' + point.y + ' '
    )
  }, '')

  dPathAttribute += 'z'

  return dPathAttribute
}

export const createPath = (points = [], attrs = {}) => {
  const path = document.createElementNS(SVG_NS_URI, 'path')
  path.setAttribute('d', createPathAttribute(points))
  Object.keys(attrs).forEach(attributeName => {
    path.setAttribute(attributeName, attrs[attributeName])
  })
  return path
}

export const createText = ({ text, x, y, attrs = {} }) => {
  const textElement = document.createElementNS(SVG_NS_URI, 'text')
  textElement.innerHTML = text

  const DEFAULT_TEXT_ATTRIBUTES = {
    'text-anchor': 'middle',
    'alignment-baseline': 'central'
  }

  const allAttrs = Object.assign({}, DEFAULT_TEXT_ATTRIBUTES, attrs, { x, y })

  Object.keys(allAttrs).forEach(attributeName => {
    textElement.setAttribute(attributeName, allAttrs[attributeName])
  })

  return textElement
}

export const createCircle = ({ radius, cx = 0, cy = 0, stroke = 'black' }) => {
  const circleElement = document.createElementNS(SVG_NS_URI, 'circle')
  const attrs = {
    cx,
    cy,
    r: radius,
    stroke,
    'fill-opacity': 0
  }

  Object.keys(attrs).forEach(attributeName => {
    circleElement.setAttribute(attributeName, attrs[attributeName])
  })

  return circleElement
}
