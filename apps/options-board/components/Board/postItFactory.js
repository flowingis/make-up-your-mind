import {
  getMousePosition,
  encodeTransformAttribute,
  decodeTransformAttribute
} from 'board/utils/svg'

export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

const DRAGGABLE_CLASS = 'draggable'
const HEIGHT = 76
const WIDTH = 127

const isMineEvent = (event, index) => {
  const indexAttribute = event.target.getAttribute('data-index')
  if (!indexAttribute) {
    return false
  }

  return parseInt(indexAttribute, 10) === index
}

const createNode = ({ x, y, color, index, attrs = {} }) => {
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

const factory = ({ parent, x, y, color, index, attrs = {} }) => {
  const node = createNode({ x, y, color, index, attrs })
  let active = false
  let offset

  const startDrag = event => {
    if (isMineEvent(event, index)) {
      const coords = getMousePosition(parent, event)

      const traslateCoords = decodeTransformAttribute(
        node.getAttributeNS(null, 'transform')
      )

      offset = {
        x: coords.x - traslateCoords.x,
        y: coords.y - traslateCoords.y
      }
      active = true
    }
  }

  const onDrag = event => {
    if (!active) {
      return
    }

    let { x, y } = getMousePosition(parent, event)

    x -= offset.x
    y -= offset.y

    node.setAttribute('transform', encodeTransformAttribute({ x, y }))
  }

  const endDrag = e => {
    active = false
    offset = undefined
  }

  return {
    startDrag,
    onDrag,
    endDrag,
    get node () {
      return node
    },
    get position () {
      return decodeTransformAttribute(node.getAttributeNS(null, 'transform'))
    }
  }
}

export default factory
