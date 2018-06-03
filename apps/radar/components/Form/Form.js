import template from './Form.tpl.html'

import { htmlToElement, bindEvents, updateProps } from 'radar/utils/dom'

const MAX_ROWS = 8
const MIN_ROWS = 3

class Form extends HTMLElement {
  constructor () {
    super()
    this.rowContainer = undefined
  }

  static get observedAttributes () {
    return ['data']
  }

  get addButtonDisabled () {
    return this.data.length >= MAX_ROWS
  }

  get removeButtonDisabled () {
    return this.data.length <= MIN_ROWS
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

  onAddClick () {
    if (this.data.length < MAX_ROWS) {
      const event = new window.CustomEvent('add-row', { bubbles: true })
      this.dispatchEvent(event)
    }
  }

  onRemoveClick () {
    if (this.data.length > MIN_ROWS) {
      const event = new window.CustomEvent('remove-row', { bubbles: true })
      this.dispatchEvent(event)
    }
  }

  onResetClick () {
    const event = new window.CustomEvent('reset', { bubbles: true })
    this.dispatchEvent(event)
  }

  render () {
    const main = htmlToElement(template)
    const { data } = this
    if (data.length === 0) {
      return
    }

    this.appendChild(main)

    bindEvents(main, this, 'click')
    updateProps(this)

    this.rowContainer = this.querySelector('app-form-row-container')
  }

  connectedCallback () {
    this.render()
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (this.rowContainer) {
      window.requestAnimationFrame(() => {
        this.rowContainer.data = this.data
        updateProps(this)
      })
    } else {
      this.render()
    }
  }
}

export default Form
