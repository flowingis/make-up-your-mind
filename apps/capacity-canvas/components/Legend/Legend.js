import markerFactory from './marker'
import draggableFactory from './draggable'

const EVENTS_NAMESPACE = 'LEGEND'

export const EVENTS = {
  MARKER_POSITION_CHANGE: `${EVENTS_NAMESPACE}/CHANGE_POSITION`
}
class Legend extends HTMLElement {
  constructor () {
    super()
    this.sync = this.syncContent.bind(this)
    this.onMarkerMove = this.onMarkerMove.bind(this)
    this.observedElement = undefined
    this.unsubscribe = () => {}
  }

  get selector () {
    return this.getAttribute('selector')
  }

  set selector (value) {
    this.setAttribute('selector', value)
  }

  get updateOnEventName () {
    return this.getAttribute('update-on')
  }

  set updateOnEventName (event) {
    this.setAttribute('update-on', event)
  }

  attachObserver () {
    this.syncContent()
    this.syncMarker()

    const updateOnEventName = this.updateOnEventName
    if (!updateOnEventName) {
      return
    }

    this.observedElement.addEventListener(
      updateOnEventName,
      () => {
        window.requestIdleCallback(() => {
          this.innerHTML = ''
          this.syncContent()
          this.syncMarker()
        })
      },
      false
    )
  }

  syncContent () {
    const canvasCopy = this.observedElement
      .querySelector('svg')
      .cloneNode(true)
    this.appendChild(canvasCopy)
  }

  onMarkerMove (position) {
    const event = new window.CustomEvent(EVENTS.MARKER_POSITION_CHANGE, {
      detail: position,
      bubbles: true
    })

    this.dispatchEvent(event)
  }

  syncMarker () {
    this.marker = draggableFactory(
      markerFactory(this, this.observedElement),
      this,
      this.onMarkerMove
    )
    this.appendChild(this.marker.node)
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
