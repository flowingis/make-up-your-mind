import { createAttributesObserver } from 'lib/utils/dom'
import markerFactory from './marker'

class Legend extends HTMLElement {
  constructor () {
    super()
    this.sync = this.syncContent.bind(this)
    this.observedElement = undefined
    this.unsubscribe = () => {}
  }

  get selector () {
    return this.getAttribute('selector')
  }

  set selector (value) {
    this.setAttribute('selector', value)
  }

  attachObserver () {
    this.syncContent()
    this.syncMarker()

    this.unsubscribe = createAttributesObserver(this.observedElement, () => {
      window.requestIdleCallback(() => {
        this.innerHTML = ''
        this.syncContent()
        this.syncMarker()
      })
    })
  }

  syncContent () {
    const canvasCopy = this.observedElement
      .querySelector('svg')
      .cloneNode(true)
    this.appendChild(canvasCopy)
  }

  syncMarker () {
    this.marker = markerFactory(this, this.observedElement)
    this.appendChild(this.marker)
  }

  syncDimensions () {
    const { innerWidth, innerHeight } = window
    const myHeight = Math.floor(this.clientWidth * innerHeight / innerWidth)
    this.style.height = `${myHeight}px`
  }

  render () {
    this.observedElement = document.querySelector(this.selector)
    if (!this.observedElement) {
      return
    }

    this.syncDimensions()
    this.attachObserver()
  }

  disconnectedCallback () {
    this.unsubscribe()
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback () {
    window.requestAnimationFrame(this.render)
  }
}

export default Legend
