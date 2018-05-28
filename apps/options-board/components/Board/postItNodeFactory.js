import { encodeTransformAttribute, SVG_NS_URI } from 'board/utils/svg'

const DRAGGABLE_CLASS = 'draggable'
const HEIGHT = 76
const WIDTH = 127

const createPostItNode = (color, index) => {
  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('fill', color)
  postIt.setAttribute('height', HEIGHT)
  postIt.setAttribute('width', WIDTH)
  postIt.setAttribute('data-index', index)
  return postIt
}

const createTextNode = index => {
  const textNode = document.createElementNS(SVG_NS_URI, 'text')

  textNode.setAttribute('alignment-baseline', 'middle')
  textNode.setAttribute('text-anchor', 'middle')
  textNode.setAttribute('x', WIDTH / 2)
  textNode.setAttribute('y', HEIGHT / 2)
  textNode.setAttribute('font-size', 20)

  textNode.appendChild(document.createTextNode(index + 1))
  return textNode
}

export default ({ x, y, color, index }) => {
  const group = document.createElementNS(SVG_NS_URI, 'g')

  group.setAttribute('class', DRAGGABLE_CLASS)
  group.setAttribute('transform', encodeTransformAttribute({ x, y }))

  group.appendChild(createPostItNode(color, index))
  group.appendChild(createTextNode(index))

  return group
}
