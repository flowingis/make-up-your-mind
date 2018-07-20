import {
  getMousePosition,
  encodeTransformAttribute,
  decodeTransformAttribute
} from 'lib/utils/svg'

const START_EVENTS = ['mousedown', 'touchstart']
const DRAG_EVENTS = ['mousemove', 'touchmove']
const END_EVENTS = ['mouseleave', 'mouseup', 'touchend']

export const DRAGGABLE_EVENTS = {
  START_EVENTS,
  DRAG_EVENTS,
  END_EVENTS
}

const isMineEvent = (event, index) => {
  const indexAttribute = event.target.getAttribute('data-index')
  if (!indexAttribute) {
    return false
  }

  return parseInt(indexAttribute, 10) === index
}

const factory = ({ parent, node, index }) => {
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
