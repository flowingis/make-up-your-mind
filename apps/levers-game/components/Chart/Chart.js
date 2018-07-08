import { htmlToElement } from 'radar/utils/dom'
import blockFactory from './block'

import style from './Chart.component.css'

import template from './Chart.svg.html'

const START_EVENTS = ['mousedown', 'touchstart']

const DRAG_EVENTS = ['mousemove', 'touchmove']

const END_EVENTS = ['mouseleave', 'mouseup', 'touchend']

const EVENTS_NAMESPACE = 'LEVERS_CHART'

export const EVENTS = {
  CHANGE_POSITION: `${EVENTS_NAMESPACE}/CHANGE_POSITION`
}
class Chart extends HTMLElement {
  constructor () {
    super()
    this.startDrag = this.startDrag.bind(this)
    this.onDrag = this.onDrag.bind(this)
    this.endDrag = this.endDrag.bind(this)
    this.render = this.render.bind(this)
    this.activeBlock = undefined
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
    this.blocks.forEach(p => p.startDrag(event))
    this.activeBlock = this.blocks.find(b => b.active)
  }

  onDrag (event) {
    event.preventDefault()
    this.blocks.forEach(p => p.onDrag(event))
  }

  endDrag (event) {
    event.preventDefault()
    this.blocks.forEach(p => p.endDrag(event))
    if (this.activeBlock) {
      const event = new window.CustomEvent(EVENTS.CHANGE_POSITION, {
        detail: {
          name: this.activeBlock.name,
          coords: this.activeBlock.coords
        },
        bubbles: true
      })

      this.dispatchEvent(event)
    }
  }

  render () {
    this.innerHTML = ''

    const chart = htmlToElement(template)

    chart.appendChild(htmlToElement(`<style>${style}</style>`))

    this.blocks = this.data.map((element, index) => {
      const block = chart.querySelector(`[data-block="${element}"]`)
      return blockFactory({
        parent: chart,
        node: block,
        index
      })
    })

    this.appendChild(chart)

    START_EVENTS.forEach(event =>
      chart.addEventListener(event, this.startDrag)
    )
    DRAG_EVENTS.forEach(event => chart.addEventListener(event, this.onDrag))
    END_EVENTS.forEach(event => chart.addEventListener(event, this.endDrag))
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Chart
