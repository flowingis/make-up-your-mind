export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

export default ({ x, y, color, index, attrs = {} }) => {
  const group = document.createElementNS(SVG_NS_URI, 'g')

  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('x', x)
  postIt.setAttribute('y', y)
  postIt.setAttribute('fill', color)
  postIt.setAttribute('data-index', index)

  Object.keys(attrs).forEach(attributeName => {
    postIt.setAttribute(attributeName, attrs[attributeName])
  })

  group.appendChild(postIt)

  return group
}
