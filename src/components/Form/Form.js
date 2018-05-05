import dataParser from 'src/model/dataParser'
import template from './Form.tpl.html'
import rowTemplate from './row.tpl.html'
import { newIndexedArray } from 'src/utils/array'
import { htmlToElement } from 'src/utils/dom'

const RANGE_SELECTOR = 'input[role="chart-value-input"]'
const LABEL_SELECTOR = 'input[role="chart-label-input"]'

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

const onDataChange = element => {
  const data = getData(element)
  const event = new window.CustomEvent('data-change', { detail: data })
  element.dispatchEvent(event)
}

const addRow = (element, parent) => {
  const row = htmlToElement(rowTemplate)
  parent.appendChild(row)

  Array.from(row.querySelectorAll('input')).forEach(input => {
    input.addEventListener('input', () => onDataChange(element))
  })
}

const render = element => {
  element.innerHTML = ''

  const main = htmlToElement(template)
  const container = main.querySelector('.vertical-container')
  newIndexedArray(5).forEach(() => addRow(element, container))

  main.querySelector('button[data-add]').addEventListener('click', () => {
    addRow(element, container)
    onDataChange(element)
  })

  main.querySelector('button[data-remove]').addEventListener('click', () => {
    container.removeChild(container.lastChild)
    onDataChange(element)
  })

  element.appendChild(main)
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

  connectedCallback () {
    render(this)
    this.data = getData(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {}
}

export default Form
