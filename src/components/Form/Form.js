import dataParser from 'src/model/dataParser'
import template from './Form.tpl.html'
import rowTemplate from './row.tpl.html'
import { newIndexedArray } from 'src/utils/array'
import {
  htmlToElement,
  bindEvents,
  createChildListObserver,
  updateProps
} from 'src/utils/dom'

const RANGE_SELECTOR = 'input[role="chart-value-input"]'
const LABEL_SELECTOR = 'input[role="chart-label-input"]'
const STARTING_ROWS = 5
const MAX_ROWS = 8
const MIN_ROWS = 3

const getValueFromElements = (element, selector) => {
  return Array.from(element.querySelectorAll(selector)).map(
    input => input.value
  )
}

const getData = element => {
  const labels = getValueFromElements(element, LABEL_SELECTOR)

  const values = getValueFromElements(element, RANGE_SELECTOR).map(value =>
    parseInt(value, 10)
  )

  return labels.map((label, index) => ({
    label,
    value: values[index]
  }))
}

class Form extends HTMLElement {
  constructor () {
    super()
    this.formContainer = undefined
    this.numberOfRows = STARTING_ROWS
  }

  static get observedAttributes () {
    return ['data']
  }

  get addButtonDisabled () {
    return this.numberOfRows >= MAX_ROWS
  }

  get removeButtonDisabled () {
    return this.numberOfRows <= MIN_ROWS
  }

  get data () {
    if (!this.hasAttribute('data')) {
      return []
    }

    return dataParser.decode(this.getAttribute('data'))
  }

  set data (obj) {
    this.setAttribute('data', dataParser.encode(obj))
  }

  onDataChange () {
    const data = getData(this)
    const event = new window.CustomEvent('data-change', { detail: data })
    this.dispatchEvent(event)
  }

  addRow () {
    const row = htmlToElement(rowTemplate)
    this.formContainer.appendChild(row)
    return row
  }

  onAddClick () {
    if (this.numberOfRows < MAX_ROWS) {
      const row = this.addRow()
      bindEvents(row, this, 'input')
      this.onDataChange()
    }
  }

  onRowListChange (mutation) {
    this.numberOfRows = mutation.target.childNodes.length - 1
    updateProps(this)
  }

  onRemoveClick () {
    if (this.numberOfRows > MIN_ROWS) {
      const container = this.querySelector('.vertical-container')
      container.removeChild(container.lastChild)
      this.onDataChange()
    }
  }

  render () {
    const main = htmlToElement(template)

    this.formContainer = main.querySelector('.vertical-container')

    newIndexedArray(STARTING_ROWS).forEach(() => this.addRow())

    this.appendChild(main)

    bindEvents(main, this, 'click', 'input')
    updateProps(this)
  }

  connectedCallback () {
    this.render(this)
    this.data = getData(this)
    this.unsubscribe = createChildListObserver(this.formContainer, e =>
      this.onRowListChange(e)
    )
  }

  disconnectedCallback () {
    this.unsubscribe()
  }
}

export default Form
