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
    this.numberOfRows = 0
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

  addRow (rowData) {
    const row = htmlToElement(rowTemplate)
    row.querySelector('input').value = rowData.label
    Object.keys(rowData.values).forEach(series => {
      const value = rowData.values[series]
      row.querySelector(`[data-series="${series}"]`).value = value
    })
    this.formContainer.appendChild(row)
    return row
  }

  onAddClick () {
    if (this.numberOfRows < MAX_ROWS) {
      const row = this.addRow({
        label: `Value ${this.numberOfRows + 1}`,
        values: {
          first: 20,
          second: 20
        }
      })

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
    const { data } = this
    if (data.length === 0) {
      return
    }

    this.formContainer = main.querySelector('.vertical-container')

    data.forEach(value => {
      this.addRow(value)
    })

    this.numberOfRows = data.length

    this.appendChild(main)

    bindEvents(main, this, 'click', 'input')
    updateProps(this)
    this.unsubscribe = createChildListObserver(this.formContainer, e =>
      this.onRowListChange(e)
    )
  }

  connectedCallback () {
    this.render()
  }

  disconnectedCallback () {
    this.unsubscribe()
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (newValue !== JSON.stringify(getData(this))) {
      window.requestAnimationFrame(() => {
        this.innerHTML = ''
        this.render()
      })
    }
  }
}

export default Form
