import { getMousePosition } from 'board/utils/svg'
import createPostIt from './createPostIt'
import { getPostItColor } from './colors'
import template from './BoardTemplate.svg.html'

const DRAGGABLE_CLASS = 'draggable'

const DEFAULT_POST_IT_ATTRS = {
  class: DRAGGABLE_CLASS,
  width: 127,
  height: 76
}

const isDraggable = element => element.classList.contains(DRAGGABLE_CLASS)

class Board extends HTMLElement {
  constructor () {
    super()
    this.currentDraggable = undefined
    this.currentOffset = undefined

    this.startDrag = this.startDrag.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
    this.render = this.render.bind(this)
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
    const { target } = event
    if (isDraggable(target)) {
      const offset = getMousePosition(this.svg, event)

      offset.x -= parseFloat(target.getAttributeNS(null, 'x'))
      offset.y -= parseFloat(target.getAttributeNS(null, 'y'))

      this.currentOffset = offset
      this.currentDraggable = event.target
    }
  }

  onDrag (event) {
    event.preventDefault()
    if (this.currentDraggable) {
      const { x, y } = getMousePosition(this.svg, event)
      this.currentDraggable.setAttributeNS(null, 'x', x - this.currentOffset.x)
      this.currentDraggable.setAttributeNS(null, 'y', y - this.currentOffset.y)
    }
  }

  endDrag (event) {
    if (this.currentDraggable) {
      const newData = [...this.data]
      const currentIndex = parseInt(
        this.currentDraggable.getAttribute('data-index')
      )
      const x = parseInt(this.currentDraggable.getAttribute('x'))
      const y = parseInt(this.currentDraggable.getAttribute('y'))

      newData[currentIndex] = {
        ...newData[currentIndex],
        x,
        y
      }

      this.data = newData
    }

    this.currentDraggable = undefined
    this.currentOffset = undefined
  }

  render () {
    this.innerHTML = template

    this.svg = this.querySelector('svg')

    this.svg.addEventListener('mousedown', this.startDrag)
    this.svg.addEventListener('mousemove', this.onDrag)
    this.svg.addEventListener('mouseup', this.endDrag)
    this.svg.addEventListener('mouseleave', this.endDrag)

    if (!this.showLegend) {
      this.svg.querySelector('[data-legend]').classList.add('hidden')
    }

    this.data
      .map((element, index) =>
        createPostIt({
          ...element,
          index,
          color: getPostItColor(index),
          attrs: DEFAULT_POST_IT_ATTRS
        })
      )
      .forEach(postIt => {
        this.svg.appendChild(postIt)
      })
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Board
