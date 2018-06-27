import render from './render'

const DEFAULT_RADIUS = 350
class Chart extends HTMLElement {
  constructor () {
    super()
    this.render = this.render.bind(this)
  }

  static get observedAttributes () {
    return ['data', 'hide-legend']
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

  get radius () {
    if (!this.hasAttribute('radius')) {
      return DEFAULT_RADIUS
    }
    return parseInt(this.getAttribute('radius'), 10)
  }

  set radius (value) {
    this.setAttribute('radius', value)
  }

  get hideLegend () {
    return this.hasAttribute('hide-legend')
  }

  set hideLegend (val) {
    if (val) {
      this.setAttribute('hide-legend', '')
    } else {
      this.removeAttribute('hide-legend')
    }
  }

  render () {
    render(this, this.data, this.radius, this.hideLegend)
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Chart
