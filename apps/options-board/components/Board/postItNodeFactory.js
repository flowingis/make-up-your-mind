import { encodeTransformAttribute, SVG_NS_URI } from 'board/utils/svg'

const DRAGGABLE_CLASS = 'draggable'
const HEIGHT = 76
const WIDTH = 127

export default ({ x, y, color, index, attrs = {} }) => {
  const group = document.createElementNS(SVG_NS_URI, 'g')

  group.setAttribute('class', DRAGGABLE_CLASS)
  group.setAttribute('transform', encodeTransformAttribute({ x, y }))

  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('fill', color)
  postIt.setAttribute('height', HEIGHT)
  postIt.setAttribute('width', WIDTH)
  postIt.setAttribute('data-index', index)

  Object.keys(attrs).forEach(attributeName => {
    postIt.setAttribute(attributeName, attrs[attributeName])
  })

  group.appendChild(postIt)

  return group
}
