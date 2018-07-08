import shuffle from 'lodash.shuffle'
import sortBy from 'lodash.sortby'
import { htmlToElement } from 'radar/utils/dom'
import blockFactory, { BLOCKS_COORDS } from './block'
import style from './Chart.component.css'

import template from './Chart.svg.html'

const DATA = shuffle(['quality', 'budget', 'scope', 'deadline'])

const START_EVENTS = ['mousedown', 'touchstart']

const DRAG_EVENTS = ['mousemove', 'touchmove']

const END_EVENTS = ['mouseleave', 'mouseup', 'touchend']

const orderDataByY = ({ name, lastCoords, allCoords, data }) => {
  let temporaryData = allCoords.map((coords, i) => {
    return {
      coords,
      name: data[i]
    }
  })

  temporaryData = temporaryData.filter(element => element.name !== name)

  temporaryData.push({
    name,
    coords: lastCoords
  })

  return sortBy(temporaryData, 'coords.y').map(element => element.name)
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
      this.data = orderDataByY({
        name: this.activeBlock.name,
        allCoords: BLOCKS_COORDS,
        data: this.data,
        lastCoords: this.activeBlock.coords
      })
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
