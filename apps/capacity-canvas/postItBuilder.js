import { encodeTransformAttribute, SVG_NS_URI } from 'lib/utils/svg'

const HEIGHT = 76
const WIDTH = 127
const DIMENSION_RATIO = WIDTH / HEIGHT
const DEFAULT_COLOR = '#E4EF49'

const DRAGGABLE_CLASS = 'draggable'
const BASE_FONTSIZE = 20

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

const create = ({ color, width, height }) => ({ x, y, index, label }) => {
  const group = document.createElementNS(SVG_NS_URI, 'g')

  const textLabel = label || index + 1

  group.setAttribute('class', DRAGGABLE_CLASS)
  group.setAttribute('transform', encodeTransformAttribute({ x, y }))

  group.appendChild(createPostItNode(width, height, color, index))
  group.appendChild(createTextNode(width, height, textLabel, index))

  return group
}

export default () => {
  const toReturn = {}

  let data = {
    width: WIDTH,
    height: HEIGHT,
    color: DEFAULT_COLOR
  }

  toReturn.withWidth = width => {
    data = {
      ...data,
      width,
      height: width / DIMENSION_RATIO
    }

    return toReturn
  }

  toReturn.withHeight = height => {
    data = {
      ...data,
      height,
      width: DIMENSION_RATIO / height
    }

    return toReturn
  }

  toReturn.withColor = color => {
    data = {
      ...data,
      color
    }
  }

  toReturn.create = ({ x, y, index, label }) => {
    return create(data)({ x, y, index, label })
  }

  return toReturn
}
