import {
  getMousePosition,
  encodeTransformAttribute,
  decodeTransformAttribute
} from 'lib/utils/svg'

const BLOCKS_COORDS = [
  {
    x: 50.5,
    y: 68.967
  },
  {
    x: 50.5,
    y: 115.51
  },
  {
    x: 50.5,
    y: 163.134
  },
  {
    x: 50.5,
    y: 209.677
  }
]

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

      console.log(node.getAttributeNS(null, 'transform'), traslateCoords)

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
    translate(node, index)
  }

  return {
    startDrag,
    onDrag,
    endDrag,
    get node () {
      return node
    }
  }
}
