export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

export const generatePathAttribute = (points = []) => {
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
  path.setAttribute('d', generatePathAttribute(points))
  Object.keys(attrs).forEach(attributeName => {
    path.setAttribute(attributeName, attrs[attributeName])
  })
  return path
}
