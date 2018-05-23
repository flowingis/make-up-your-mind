import template from './Form.tpl.html'
import rowTemplate from './row.tpl.html'
import {
  htmlToElement,
  bindEvents,
  createChildListObserver,
  updateProps
} from 'radar/utils/dom'

const RANGE_SELECTOR = 'input[role="chart-value-input"]'
const LABEL_SELECTOR = 'input[role="chart-label-input"]'
const STARTING_ROWS = 5
const MAX_ROWS = 8
const MIN_ROWS = 3

const getData = element => {
  const rows = Array.from(element.querySelectorAll('.form-row'))

  return rows.map(row => {
    const label = row.querySelector(LABEL_SELECTOR).value
    const values = Array.from(row.querySelectorAll(RANGE_SELECTOR)).reduce(
      (acc, range) => {
        acc[range.getAttribute('data-series')] = parseInt(range.value, 10)
        return acc
      },
      {}
    )

    return {
      label,
      values
    }
  })
}

class Form extends HTMLElement {
  constructor () {
    super()
    this.formContainer = undefined
    this.numberOfRows = STARTING_ROWS
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

    return JSON.parse(this.getAttribute('data'))
  }

  set data (obj) {
    this.setAttribute('data', JSON.stringify(obj))
  }

  onDataChange () {
    const data = getData(this)
    const event = new window.CustomEvent('data-change', { detail: data })
    this.dispatchEvent(event)
  }

  addRow (value) {
    const row = htmlToElement(rowTemplate)
    row.querySelector('input').value = `Value ${value}`
    this.formContainer.appendChild(row)
    return row
  }

  onAddClick () {
    if (this.numberOfRows < MAX_ROWS) {
      const row = this.addRow(this.numberOfRows + 1)
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

    for (let i = 0; i < STARTING_ROWS; i++) {
      this.addRow(i + 1)
    }

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
