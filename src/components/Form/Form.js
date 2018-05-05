import dataParser from 'src/model/dataParser'
import template from './Form.tpl.html'
import rowTemplate from './row.tpl.html'
import { newIndexedArray } from 'src/utils/array'
import { htmlToElement } from 'src/utils/dom'

const RANGE_SELECTOR = 'input[role="chart-value-input"]'
const LABEL_SELECTOR = 'input[role="chart-label-input"]'
const STARTING_ROWS = 5

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

  addRow (container) {
    container = container || this.querySelector('.vertical-container')
    const row = htmlToElement(rowTemplate)
    container.appendChild(row)

    Array.from(row.querySelectorAll('input')).forEach(input => {
      input.addEventListener('input', () => this.onDataChange())
    })
  }

  onAddClick () {
    this.addRow()
    this.onDataChange()
  }

  onRemoveClick () {
    const container = this.querySelector('.vertical-container')
    container.removeChild(container.lastChild)
    this.onDataChange()
  }

  render () {
    const main = htmlToElement(template)
    const container = main.querySelector('.vertical-container')

    newIndexedArray(STARTING_ROWS).forEach(() => this.addRow(container))

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
