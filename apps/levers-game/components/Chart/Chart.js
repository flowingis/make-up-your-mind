import shuffle from 'lodash.shuffle'
import { htmlToElement } from 'radar/utils/dom'

import template from './Chart.svg.html'

const BLOCKS_COORDS = [
  {
    x: 50.5,
    y: 68.967
  },
  {
    x: 50.5,
    y: 115.51
  },
  {
    x: 50.5,
    y: 163.134
  },
  {
    x: 50.5,
    y: 209.677
  }
]

const DATA = shuffle(['quality', 'budget', 'scope', 'deadline'])

class Chart extends HTMLElement {
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

  render () {
    this.innerHTML = ''

    const chart = htmlToElement(template)

    this.data.forEach((element, index) => {
      const block = chart.querySelector(`[data-block="${element}"]`)
      block.setAttribute(
        'transform',
        `translate(${BLOCKS_COORDS[index].x} ${BLOCKS_COORDS[index].y})`
      )
    })

    this.appendChild(chart)
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Chart
