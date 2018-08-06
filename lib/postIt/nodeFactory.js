import { encodeTransformAttribute, SVG_NS_URI } from 'lib/utils/svg'

const DRAGGABLE_CLASS = 'draggable'
const BASE_FONTSIZE = 15

const calculateFontSize = (width, label) => {
  const approximateTextWidth = BASE_FONTSIZE * 0.5 * label.length
  const ratio = approximateTextWidth / width
  if (ratio <= 0.9) {
    return BASE_FONTSIZE
  }

  return width * 0.9 / label.length * 2
}

const createPostItNode = (width, height, color, index) => {
  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('fill', color)
  postIt.setAttribute('height', height)
  postIt.setAttribute('width', width)
  postIt.setAttribute('data-index', index)
  return postIt
}

const createTextNode = (width, height, label, index) => {
  const textNode = document.createElementNS(SVG_NS_URI, 'text')

  textNode.setAttribute('alignment-baseline', 'middle')
  textNode.setAttribute('text-anchor', 'middle')
  textNode.setAttribute('x', width / 2)
  textNode.setAttribute('y', height / 2)
  textNode.setAttribute('font-size', calculateFontSize(width, label))
  textNode.setAttribute('data-index', index)

  textNode.appendChild(document.createTextNode(label))
  return textNode
}

const createDeleteNode = (width, height, label, index, color) => {
  const textNode = document.createElementNS(SVG_NS_URI, 'text')

  textNode.setAttribute('alignment-baseline', 'middle')
  textNode.setAttribute('text-anchor', 'middle')
  textNode.setAttribute('x', width)
  textNode.setAttribute('y', height)
  textNode.setAttribute('font-size', '18')
  textNode.setAttribute('font-weight', 'bold')
  textNode.setAttribute('cursor', 'default')
  textNode.setAttribute('data-index', index)
  textNode.setAttribute('data-remove-by-index', index)
  textNode.setAttribute('listner-added', false)
  textNode.setAttribute('stroke', color)
  textNode.appendChild(document.createTextNode(label))
  return textNode
}

export default ({ color, width, height, x, y, index, label }) => {
  const group = document.createElementNS(SVG_NS_URI, 'g')

  const textLabel = label || index + 1

  group.setAttribute('class', DRAGGABLE_CLASS)
  group.setAttribute('transform', encodeTransformAttribute({ x, y }))

  group.appendChild(createPostItNode(width, height, color, index))
  group.appendChild(createTextNode(width, height, textLabel, index))
  group.appendChild(createDeleteNode(width, 0, '✖', index, color))

  // const toggleButton = document.querySelector('button[data-toggle-legend]')

  return group
}
