import render from './render'

class Chart extends HTMLElement {
  constructor () {
    super()
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

  get radius () {
    if (!this.hasAttribute('radius')) {
      return 400
    }
    return parseInt(this.getAttribute('radius'), 10)
  }

  set radius (value) {
    this.setAttribute('radius', value)
  }

  render () {
    render(this, this.data, this.radius)
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Chart
