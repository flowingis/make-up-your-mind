export const SVG_NS_URI = 'http://www.w3.org/2000/svg'

const TEMPLATE = `
    <svg viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg">
    </svg>
`

const DEFAULT_POST_IT_ATTRS = {
  class: 'draggable',
  width: 127,
  height: 76
}

const createPostIt = ({ x, y, color, attrs = {} }) => {
  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('x', x)
  postIt.setAttribute('y', y)
  postIt.setAttribute('fill', color)

  const currentAttrs = {
    ...DEFAULT_POST_IT_ATTRS,
    ...attrs
  }

  Object.keys(currentAttrs).forEach(attributeName => {
    postIt.setAttribute(attributeName, currentAttrs[attributeName])
  })
  return postIt
}

const COLORS = [
  '#E4EF49',
  '#19A1DF',
  '#FD43A7',
  '#FBA435',
  '#81D0CF',
  '#FFD333'
]

const getMousePosition = (svg, evetn) => {
  var CTM = svg.getScreenCTM()
  return {
    x: (evetn.clientX - CTM.e) / CTM.a,
    y: (evetn.clientY - CTM.f) / CTM.d
  }
}

class Board extends HTMLElement {
  constructor () {
    super()
    this.currentDraggable = undefined
    this.currentOffset = undefined

    this.startDrag = this.startDrag.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
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
    if (event.target.classList.contains('draggable')) {
      this.currentDraggable = event.target
      const offset = getMousePosition(this.svg, event)
      offset.x -= parseFloat(this.currentDraggable.getAttributeNS(null, 'x'))
      offset.y -= parseFloat(this.currentDraggable.getAttributeNS(null, 'y'))
      this.currentOffset = offset
    }
  }

  onDrag (event) {
    if (this.currentDraggable) {
      event.preventDefault()
      const { x, y } = getMousePosition(this.svg, event)
      this.currentDraggable.setAttributeNS(null, 'x', x - this.currentOffset.x)
      this.currentDraggable.setAttributeNS(null, 'y', y - this.currentOffset.y)
    }
  }

  endDrag (event) {
    this.currentDraggable = undefined
    this.currentOffset = undefined
  }

  render () {
    this.innerHTML = TEMPLATE
    this.querySelector('svg').addEventListener('load', event => {
      this.svg = event.target

      this.svg.addEventListener('mousedown', this.startDrag)
      this.svg.addEventListener('mousemove', this.onDrag)
      this.svg.addEventListener('mouseup', this.endDrag)
      this.svg.addEventListener('mouseleave', this.endDrag)

      for (let i = 0; i < 4; i++) {
        const postIt = createPostIt({
          x: 200 * (i + 1),
          y: 400,
          color: COLORS[i % COLORS.length]
        })

        this.svg.appendChild(postIt)
      }
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
