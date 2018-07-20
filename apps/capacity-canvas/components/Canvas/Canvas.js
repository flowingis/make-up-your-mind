import template from './Canvas.svg.html'
import { htmlToElement } from 'lib/utils/dom'
import postItBuilder from 'lib/postIt/builder'

const POSTIT_WIDTH = 50

const builder = postItBuilder().withWidth(POSTIT_WIDTH)

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
    const canvas = htmlToElement(template)

    this.postIts = this.data.map((element, index) => {
      return builder.create({
        ...element,
        index
      })
    })

    this.postIts.forEach(postIt => {
      canvas.appendChild(postIt)
    })

    if (this.childElementCount) {
      this.replaceChild(canvas, this.childNodes[0])
    } else {
      this.appendChild(canvas)
    }
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Canvas
