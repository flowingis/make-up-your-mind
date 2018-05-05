import dataParser from 'src/model/dataParser'
import rowTemplate from './row.tpl.html'
import { newIndexedArray } from 'src/utils/array'
import { htmlToElement } from 'src/utils/dom'

const TEMPLATE = `<div class="vertical-container"></div>`

const render = element => {
  element.innerHTML = ''
  const main = htmlToElement(TEMPLATE)
  newIndexedArray(5).forEach(() => {
    const row = htmlToElement(rowTemplate)
    main.appendChild(row)
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
  }

  attributeChangedCallback (name, oldValue, newValue) {}
}

export default Form
