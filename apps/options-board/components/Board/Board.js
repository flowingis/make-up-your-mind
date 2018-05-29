import postItFactory from './postItFactory'
import { getPostItColor } from './colors'
import template from './BoardTemplate.svg.html'

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

    this.postIts = this.data.map((element, index) =>
      postItFactory({
        ...element,
        index,
        parent: this.svg,
        color: getPostItColor(index)
      })
    )

    this.postIts.map(postIt => postIt.node).forEach(node => {
      this.svg.appendChild(node)
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
