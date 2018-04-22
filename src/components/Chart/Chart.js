import createBaseChartPoints from './model/createBaseChartPoints'
import createChartValuesPoints from './model/createChartValuesPoints'
import { createPath, createPathAttribute, createText } from 'src/utils/svg'

import { newIndexedArray } from 'src/utils/array'

const LEVELS = 5

const TEMPLATE = `
  <svg viewBox="0 0 1000 1000">
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

const updateChartValuesPath = element => {
  const { values, radius } = element
  const valuesPath = element.querySelector('[role="chart-values"]')
  if (valuesPath) {
    const points = createChartValuesPoints({ values, radius })
    valuesPath.setAttribute('d', createPathAttribute(points))
  }
}

const updateChartLabels = element => {
  const { labels } = element
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
  const { values, radius, sides, labels } = element

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
    return ['values', 'labels']
  }

  get sides () {
    if (!this.hasAttribute('sides')) {
      return 5
    }
    return parseInt(this.getAttribute('sides'), 10)
  }

  set sides (value) {
    this.setAttribute('sides', value)
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

  get values () {
    if (!this.hasAttribute('values')) {
      return []
    }

    return this.getAttribute('values')
      .split(',')
      .map(value => parseInt(value, 10))
  }

  set values (newValues) {
    this.setAttribute('values', newValues.join(','))
  }

  get labels () {
    if (!this.hasAttribute('labels')) {
      return newIndexedArray(LEVELS).map(index => `Label ${index}`)
    }

    return this.getAttribute('labels').split(',')
  }

  set labels (newLabels) {
    this.setAttribute('labels', newLabels.join(','))
  }

  connectedCallback () {
    render(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    window.requestAnimationFrame(() => {
      if (name === 'values') {
        updateChartValuesPath(this)
      }
      if (name === 'labels') {
        updateChartLabels(this)
      }
    })
  }
}

export default Chart
