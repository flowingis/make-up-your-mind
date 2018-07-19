import rowTemplate from './row.tpl.html'
import { bindEvents, updateProps } from 'radar/utils/dom'

import { htmlToElement } from 'lib/utils/dom'

const TEMPLATE = `<div class="vertical-container"></div>`

const RANGE_SELECTOR = 'input[role="chart-value-input"]'
const LABEL_SELECTOR = 'input[role="chart-label-input"]'

const getData = element => {
  const rows = Array.from(element.querySelectorAll('.form-row'))

  return rows.map(row => {
    const label = row.querySelector(LABEL_SELECTOR).value
    const values = Array.from(row.querySelectorAll(RANGE_SELECTOR)).map(range =>
      parseInt(range.value, 10)
    )

    return {
      label,
      values
    }
  })
}

const generateRow = rowData => {
  const row = htmlToElement(rowTemplate)

  row.querySelector('input').value = rowData.label
  const ranges = row.querySelectorAll('[data-series]')

  Object.keys(rowData.values).forEach((series, index) => {
    const value = rowData.values[series]
    const range = ranges[index]
    range.value = value
    range.setAttribute('data-series', series)
  })

  return row
}

class RowContainer extends HTMLElement {
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

  onDataChange () {
    const data = getData(this)
    const event = new window.CustomEvent('dataset-change', {
      detail: data,
      bubbles: false
    })
    this.dispatchEvent(event)
  }

  render () {
    const main = htmlToElement(TEMPLATE)
    const { data } = this
    if (data.length === 0) {
      return
    }

    data.map(value => generateRow(value)).forEach(row => {
      main.appendChild(row)
    })

    this.appendChild(main)

    bindEvents(main, this, 'input')

    updateProps(this)
  }

  connectedCallback () {
    this.render()
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

export default RowContainer
