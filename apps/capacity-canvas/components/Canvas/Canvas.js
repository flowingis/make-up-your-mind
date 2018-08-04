import postItBuilder, { getPostItHeight } from 'lib/postIt/builder'
import draggable, { DRAGGABLE_EVENTS } from 'lib/draggable'
import { convertPointToSvgCoords } from 'lib/utils/svg'
import render from './Canvas.render'

const POSTIT_WIDTH = 50

const builder = postItBuilder().withWidth(POSTIT_WIDTH)

const EVENTS_NAMESPACE = 'OPTIONS_BOARD'

const DEFAULT_ZOOM = 1

const DEFAULT_POSTIT_POSTION_WITH_DOM_COORDS = {
  x: (window.innerWidth - POSTIT_WIDTH) / 2,
  y: (window.innerHeight - getPostItHeight(POSTIT_WIDTH)) / 2
}

const setDefaultPostItPosition = canvas => postIt => {
  const defaultSvgPoint = convertPointToSvgCoords(
    canvas,
    DEFAULT_POSTIT_POSTION_WITH_DOM_COORDS
  )
  return {
    ...defaultSvgPoint,
    ...postIt
  }
}

export const EVENTS = {
  CHANGE_POSITION: `${EVENTS_NAMESPACE}/CHANGE_POSITION`,
  ZOOM_CHANGE: `ZOOM_CHANGE`
}

const CONTAINER_SELECTOR = 'g[data-container]'

const setZoom = (container, zoom) => {
  container.style.width = `${window.innerWidth * zoom}px`
  container.style.height = `${window.innerHeight * zoom}px`
  const event = new window.CustomEvent(EVENTS.ZOOM_CHANGE, {
    detail: zoom,
    bubbles: true
  })

  container.dispatchEvent(event)
}

const setOffset = (container, position) => {
  const { width, height } = container.getBoundingClientRect()
  const { innerHeight, innerWidth } = window
  const x = Math.max(position.x, innerWidth - width)
  const y = Math.max(position.y, innerHeight - height)
  container.style.left = `${x}px`
  container.style.top = `${y}px`
}

class Canvas extends HTMLElement {
  constructor () {
    super()
    this.currentDraggable = undefined
    this.currentOffset = undefined

    this.startDrag = this.startDrag.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
    this.render = this.render.bind(this)
    this.attachDragListeners = this.attachDragListeners.bind(this)
    this.postIts = []
  }

  static get observedAttributes () {
    return ['data', 'zoom', 'offset']
  }

  get offset () {
    if (!this.hasAttribute('offset')) {
      return {
        x: 0,
        y: 0
      }
    }

    const [x, y] = this.getAttribute('offset')
      .split(',')
      .map(parseFloat)

    return {
      x,
      y
    }
  }

  set offset (value) {
    if (!value) {
      this.removeAttribute('offset')
    }

    this.setAttribute('offset', `${value.x},${value.y}`)
  }

  get zoom () {
    return window.parseFloat(this.getAttribute('zoom')) || DEFAULT_ZOOM
  }

  set zoom (value) {
    this.setAttribute('zoom', value)
  }

  get data () {
    if (!this.hasAttribute('data')) {
      return []
    }

    return JSON.parse(this.getAttribute('data'))
  }

  set data (obj) {
    this.setAttribute('data', JSON.stringify(obj))
  }

  startDrag (event) {
    event.preventDefault()
    this.postIts.forEach(p => p.startDrag(event))
  }

  onDrag (event) {
    event.preventDefault()
    this.postIts.forEach(p => p.onDrag(event))
  }

  endDrag (event) {
    event.preventDefault()

    this.postIts.forEach(p => p.endDrag(event))

    this.data = this.data.map((element, index) => {
      return {
        ...element,
        ...this.postIts[index].position
      }
    })

    const changePositionEvent = new window.CustomEvent(EVENTS.CHANGE_POSITION)
    this.dispatchEvent(changePositionEvent)
  }

  attachDragListeners (canvas) {
    DRAGGABLE_EVENTS.START_EVENTS.forEach(event =>
      canvas.addEventListener(event, this.startDrag)
    )
    DRAGGABLE_EVENTS.DRAG_EVENTS.forEach(event =>
      canvas.addEventListener(event, this.onDrag)
    )
    DRAGGABLE_EVENTS.END_EVENTS.forEach(event =>
      canvas.addEventListener(event, this.endDrag)
    )
  }

  render () {
    const canvas = render(this)

    this.postIts = this.data
      .map(setDefaultPostItPosition(canvas))
      .map((element, index) => {
        const node = builder.create({
          ...element,
          index
        })

        return draggable({ parent: canvas, node, index })
      })

    this.postIts.forEach(postIt =>
      canvas.querySelector(CONTAINER_SELECTOR).appendChild(postIt.node)
    )

    this.attachDragListeners(canvas)
  }

  connectedCallback () {
    this.render()
    setZoom(this, this.zoom)
    setOffset(this, this.offset)
  }

  attributeChangedCallback (name) {
    if (name === 'data') {
      window.requestAnimationFrame(this.render)
      return
    }

    if (name === 'zoom') {
      window.requestAnimationFrame(() => {
        setZoom(this, this.zoom)
        setOffset(this, this.offset)
      })
    }

    if (name === 'offset') {
      window.requestAnimationFrame(() => {
        setOffset(this, this.offset)
      })
    }
  }
}

export default Canvas
