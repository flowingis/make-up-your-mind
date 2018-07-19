import template from './Canvas.svg.html'

class Canvas extends HTMLElement {
  constructor () {
    super()
    this.render = this.render.bind(this)
    this.postIts = []
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

  render () {
    console.log('Rendering', this.data)
    this.innerHTML = template
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Canvas
