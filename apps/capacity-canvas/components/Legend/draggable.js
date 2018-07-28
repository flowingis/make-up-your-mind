import normalizeDraggablePosition from './model/normalizeDraggablePosition'

const START_EVENTS = ['mousedown', 'touchstart']
const DRAG_EVENTS = ['mousemove', 'touchmove']
const END_EVENTS = ['mouseleave', 'mouseup', 'touchend']

export default (node, parent) => {
  node.classList.add('draggable')

  const { left, top, width, height } = parent.getBoundingClientRect()
  let offset

  const onMove = e => {
    const { pageX, pageY } = e
    const nodeDOMRect = node.getBoundingClientRect()

    let x = pageX - left - offset.x
    let y = pageY - top - offset.y

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
  }

  const onStart = e => {
    offset = {
      x: e.pageX - left,
      y: e.pageY - top
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
