import shuffle from 'lodash.shuffle'
import { htmlToElement } from 'radar/utils/dom'
import blockFactory from './block'
import style from './Chart.component.css'

import template from './Chart.svg.html'

const DATA = shuffle(['quality', 'budget', 'scope', 'deadline'])

const START_EVENTS = ['mousedown', 'touchstart']

const DRAG_EVENTS = ['mousemove', 'touchmove']

const END_EVENTS = ['mouseleave', 'mouseup', 'touchend']

class Chart extends HTMLElement {
  constructor () {
    super()
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
      return DATA
    }

    return JSON.parse(this.getAttribute('data'))
  }

  set data (obj) {
    this.setAttribute('data', JSON.stringify(obj))
  }

  startDrag (event) {
    event.preventDefault()
    this.blocks.forEach(p => p.startDrag(event))
  }

  onDrag (event) {
    event.preventDefault()
    this.blocks.forEach(p => p.onDrag(event))
  }

  endDrag (event) {
    event.preventDefault()
    this.blocks.forEach(p => p.endDrag(event))
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
