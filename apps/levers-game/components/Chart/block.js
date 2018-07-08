import {
  getMousePosition,
  encodeTransformAttribute,
  decodeTransformAttribute
} from 'lib/utils/svg'

import { BLOCKS_COORDS } from 'levers/levers'

const isMineEvent = (node, event) => {
  const group = event.target.closest('g[data-block]')

  if (!group) {
    return false
  }

  return group.getAttribute('data-block') === node.getAttribute('data-block')
}

const translate = (node, index) => {
  node.setAttribute(
    'transform',
    encodeTransformAttribute(BLOCKS_COORDS[index])
  )
}

export default ({ parent, node, index }) => {
  translate(node, index)

  let active = false
  let offset

  const startDrag = event => {
    if (isMineEvent(node, event)) {
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
    get name () {
      return node.getAttribute('data-block')
    },
    get coords () {
      return decodeTransformAttribute(node.getAttribute('transform'))
    },
    get active () {
      return active
    }
  }
}
