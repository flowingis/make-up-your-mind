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

const createPostIt = ({ x, y, color, index, attrs = {} }) => {
  console.log(x, y)
  const group = document.createElementNS(SVG_NS_URI, 'g')

  const postIt = document.createElementNS(SVG_NS_URI, 'rect')
  postIt.setAttribute('x', x)
  postIt.setAttribute('y', y)
  postIt.setAttribute('fill', color)
  postIt.setAttribute('data-index', index)

  const currentAttrs = {
    ...DEFAULT_POST_IT_ATTRS,
    ...attrs
  }

  Object.keys(currentAttrs).forEach(attributeName => {
    postIt.setAttribute(attributeName, currentAttrs[attributeName])
  })

  group.appendChild(postIt)

  return group
}

const COLORS = [
  '#E4EF49',
  '#19A1DF',
  '#FD43A7',
  '#FBA435',
  '#81D0CF',
  '#FFD333'
]

const getMousePosition = (svg, event) => {
  var CTM = svg.getScreenCTM()
  return {
    x: Math.floor((event.clientX - CTM.e) / CTM.a),
    y: Math.floor((event.clientY - CTM.f) / CTM.d)
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
    this.render = this.render.bind(this)
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
    if (this.currentDraggable) {
      console.log(this.data)
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

      console.log(this.data)
    }

    this.currentDraggable = undefined
    this.currentOffset = undefined
  }

  render () {
    this.innerHTML = TEMPLATE

    this.svg = this.querySelector('svg')

    this.svg.addEventListener('mousedown', this.startDrag)
    this.svg.addEventListener('mousemove', this.onDrag)
    this.svg.addEventListener('mouseup', this.endDrag)
    this.svg.addEventListener('mouseleave', this.endDrag)

    this.data
      .map((element, index) =>
        createPostIt({
          ...element,
          index,
          color: COLORS[index % COLORS.length]
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
