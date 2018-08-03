import normalizeDraggablePosition from './model/normalizeDraggablePosition'
import get from 'lodash.get'

const START_EVENTS = ['mousedown', 'touchstart']
const DRAG_EVENTS = ['mousemove', 'touchmove']
const END_EVENTS = ['mouseleave', 'mouseup', 'touchend']

export default (node, parent, onMoveListener = () => {}) => {
  node.classList.add('draggable')

  const { left, top, width, height } = parent.getBoundingClientRect()
  let offset = {
    x: 0,
    y: 0
  }

  const onMove = e => {
    const { pageX, pageY } = e
    const nodeDOMRect = node.getBoundingClientRect()

    const x = pageX - left - get(offset, 'x', 0)
    const y = pageY - top - get(offset, 'y', 0)

    const newPosition = normalizeDraggablePosition({
      x,
      y,
      nodeWidth: nodeDOMRect.width,
      nodeHeight: nodeDOMRect.height,
      parentWidth: width,
      parentHeight: height
    })

    node.style.left = `${newPosition.x}px`
    node.style.top = `${newPosition.y}px`

    onMoveListener(newPosition)
  }

  const onStart = e => {
    offset = {
      x: node.getBoundingClientRect().width / 2,
      y: node.getBoundingClientRect().height / 2
    }
    DRAG_EVENTS.forEach(envetName => {
      node.addEventListener(envetName, onMove, false)
    })
  }

  const onEnd = () => {
    offset = undefined
    DRAG_EVENTS.forEach(event => {
      node.removeEventListener(event, onMove)
    })
  }

  START_EVENTS.forEach(event => {
    node.addEventListener(event, onStart, false)
  })

  END_EVENTS.forEach(event => {
    node.addEventListener(event, onEnd, false)
  })

  return {
    node
  }
}
