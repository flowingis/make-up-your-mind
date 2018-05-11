import style from './Chart.component.css'
import createBaseChartPoints from './model/createBaseChartPoints'
import createChartValuesPoints from './model/createChartValuesPoints'
import dataParser from 'src/model/dataParser'
import { createPath, createPathAttribute, createText } from 'src/utils/svg'
import { newIndexedArray } from 'src/utils/array'

const DEFAULT_DATA = newIndexedArray(5).map(() => ({
  label: '',
  value: 0
}))

const LEVELS = 5

const TEMPLATE = `
  <svg viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <style>
      ${style.toString()}
    </style>
    <g transform="translate(500,500)">
    </g>
  </svg>
`

const createBaseChartPaths = ({ sides, radius }) =>
  newIndexedArray(LEVELS)
    .map(index => (index + 1) * (radius / LEVELS))
    .map(aRadius => {
      const points = createBaseChartPoints({ sides, radius: aRadius })
      return createPath(points, { role: 'chart-base' })
    })

const createChartValuesPath = ({ values, radius }) => {
  const point = createChartValuesPoints({ values, radius })
  return createPath(point, { role: 'chart-values' })
}

const updateChart = element => {
  const { data, radius } = element

  const values = data.map(e => e.value)
  const labels = data.map(e => e.label)

  const valuesPath = element.querySelector('[role="chart-values"]')
  if (valuesPath) {
    const points = createChartValuesPoints({ values, radius })
    valuesPath.setAttribute('d', createPathAttribute(points))
  }

  const textElements = element.querySelectorAll('[role="chart-label"]')
  if (textElements) {
    Array.from(textElements).forEach((textElement, index) => {
      textElement.innerHTML = labels[index]
    })
  }
}

const createLabels = ({ labels, radius }) => {
  const points = createBaseChartPoints({
    sides: labels.length,
    radius: radius * 1.2
  })

  return points.map((point, index) => {
    const { x, y } = point
    return createText({
      text: labels[index],
      x,
      y,
      attrs: {
        role: 'chart-label'
      }
    })
  })
}

const render = element => {
  element.innerHTML = TEMPLATE
  const { data, radius } = element

  const sides = data.length
  const values = data.map(e => e.value)
  const labels = data.map(e => e.label)

  const container = document.querySelector('svg g')

  const baseChartsPaths = createBaseChartPaths({
    sides,
    radius
  })

  baseChartsPaths.forEach(path => {
    container.appendChild(path)
  })

  container.appendChild(createChartValuesPath({ values, radius }))

  const labelElementes = createLabels({
    labels,
    radius
  })

  labelElementes.forEach(label => container.appendChild(label))
}

class Chart extends HTMLElement {
  static get observedAttributes () {
    return ['data']
  }

  get data () {
    if (!this.hasAttribute('data')) {
      return [...DEFAULT_DATA]
    }

    return dataParser.decode(this.getAttribute('data'))
  }

  set data (obj) {
    this.setAttribute('data', dataParser.encode(obj))
  }

  get radius () {
    if (!this.hasAttribute('radius')) {
      return 400
    }
    return parseInt(this.getAttribute('radius'), 10)
  }

  set radius (value) {
    this.setAttribute('radius', value)
  }

  connectedCallback () {
    render(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    window.requestAnimationFrame(() => {
      if (name === 'data') {
        const oldData = dataParser.decode(oldValue)
        if (oldData.length === this.data.length) {
          updateChart(this)
        } else {
          render(this)
        }
      }
    })
  }
}

export default Chart
