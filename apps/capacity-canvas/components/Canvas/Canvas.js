import template from './Canvas.svg.html'
import { htmlToElement } from 'lib/utils/dom'
import postItBuilder from 'lib/postIt/builder'
import draggable, { DRAGGABLE_EVENTS } from 'lib/draggable'

const POSTIT_WIDTH = 50

const builder = postItBuilder().withWidth(POSTIT_WIDTH)

const EVENTS_NAMESPACE = 'OPTIONS_BOARD'

export const EVENTS = {
  CHANGE_POSITION: `${EVENTS_NAMESPACE}/CHANGE_POSITION`
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
    return ['data']
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
    const canvas = htmlToElement(template)

    this.postIts = this.data.map((element, index) => {
      const node = builder.create({
        ...element,
        index
      })

      return draggable({ parent: canvas, node, index })
    })

    this.postIts.forEach(postIt => canvas.appendChild(postIt.node))

    if (this.childElementCount) {
      this.replaceChild(canvas, this.childNodes[0])
    } else {
      this.appendChild(canvas)
    }

    this.attachDragListeners(canvas)
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Canvas
