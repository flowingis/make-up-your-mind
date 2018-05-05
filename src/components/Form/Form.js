import dataParser from 'src/model/dataParser'
import template from './Form.tpl.html'
import rowTemplate from './row.tpl.html'
import { newIndexedArray } from 'src/utils/array'
import { htmlToElement } from 'src/utils/dom'

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

    Array.from(row.querySelectorAll('input')).forEach(input => {
      input.addEventListener('input', () => this.onDataChange())
    })
  }

  onAddClick () {
    if (this.numberOfRows < MAX_ROWS) {
      this.addRow()
      this.numberOfRows++
      this.onDataChange()
    }
  }

  onRemoveClick () {
    if (this.numberOfRows > MIN_ROWS) {
      const container = this.querySelector('.vertical-container')
      container.removeChild(container.lastChild)
      this.numberOfRows--
      this.onDataChange()
    }
  }

  render () {
    const main = htmlToElement(template)

    this.formContainer = main.querySelector('.vertical-container')

    newIndexedArray(STARTING_ROWS).forEach(() => this.addRow())

    main
      .querySelector('button[data-add]')
      .addEventListener('click', () => this.onAddClick())
    main
      .querySelector('button[data-remove]')
      .addEventListener('click', () => this.onRemoveClick())

    this.appendChild(main)
  }

  connectedCallback () {
    this.render(this)
    this.data = getData(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {}
}

export default Form
