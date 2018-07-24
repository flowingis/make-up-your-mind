import { getPostItColor } from './colors'
import template from './BoardTemplate.svg.html'
import postItBuilder from 'lib/postIt/builder'
import draggable, { DRAGGABLE_EVENTS } from 'lib/draggable'

const EVENTS_NAMESPACE = 'OPTIONS_BOARD'

const builder = postItBuilder()

export const EVENTS = {
  CHANGE_POSITION: `${EVENTS_NAMESPACE}/CHANGE_POSITION`
}

class Board extends HTMLElement {
  constructor () {
    super()
    this.currentDraggable = undefined
    this.currentOffset = undefined

    this.startDrag = this.startDrag.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
    this.render = this.render.bind(this)

    this.postIts = []
  }

  static get observedAttributes () {
    return ['data', 'show-legend']
  }

  get showLegend () {
    return this.hasAttribute('show-legend')
  }

  set showLegend (value) {
    if (value) {
      this.setAttribute('show-legend', '')
    } else {
      this.removeAttribute('show-legend')
    }
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

  render () {
    this.innerHTML = template

    this.svg = this.querySelector('svg')

    DRAGGABLE_EVENTS.START_EVENTS.forEach(event =>
      this.svg.addEventListener(event, this.startDrag)
    )
    DRAGGABLE_EVENTS.DRAG_EVENTS.forEach(event =>
      this.svg.addEventListener(event, this.onDrag)
    )
    DRAGGABLE_EVENTS.END_EVENTS.forEach(event =>
      this.svg.addEventListener(event, this.endDrag)
    )

    if (!this.showLegend) {
      this.svg.querySelector('[data-legend]').classList.add('hidden')
    }

    this.postIts = this.data.map((element, index) => {
      const node = builder.create({
        ...element,
        index,
        color: getPostItColor(index)
      })

      return draggable({ parent: this.svg, node, index })
    })

    this.postIts.forEach(postIt => this.svg.appendChild(postIt.node))
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Board
