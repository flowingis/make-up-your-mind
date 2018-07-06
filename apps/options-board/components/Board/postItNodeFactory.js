import { encodeTransformAttribute, SVG_NS_URI } from 'lib/utils/svg'

const DRAGGABLE_CLASS = 'draggable'
const HEIGHT = 76
const WIDTH = 127
const BASE_FONTSIZE = 20

const calculateFontSize = label => {
  const approximateTextWidth = BASE_FONTSIZE * 0.5 * label.length
  const ratio = approximateTextWidth / WIDTH
  if (ratio <= 0.9) {
    return BASE_FONTSIZE
  }

  return WIDTH * 0.9 / label.length * 2
}

const createPostItNode = (color, index) => {
  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('fill', color)
  postIt.setAttribute('height', HEIGHT)
  postIt.setAttribute('width', WIDTH)
  postIt.setAttribute('data-index', index)
  return postIt
}

const createTextNode = (label, index) => {
  const textNode = document.createElementNS(SVG_NS_URI, 'text')

  textNode.setAttribute('alignment-baseline', 'middle')
  textNode.setAttribute('text-anchor', 'middle')
  textNode.setAttribute('x', WIDTH / 2)
  textNode.setAttribute('y', HEIGHT / 2)
  textNode.setAttribute('font-size', calculateFontSize(label))
  textNode.setAttribute('data-index', index)

  textNode.appendChild(document.createTextNode(label))
  return textNode
}

export default ({ x, y, color, index, label }) => {
  const group = document.createElementNS(SVG_NS_URI, 'g')

  const textLabel = label || index + 1

  group.setAttribute('class', DRAGGABLE_CLASS)
  group.setAttribute('transform', encodeTransformAttribute({ x, y }))

  group.appendChild(createPostItNode(color, index))
  group.appendChild(createTextNode(textLabel, index))

  return group
}
