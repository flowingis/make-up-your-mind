import generateBaseChartPoints from './model/generateBaseChartPoints'
import generateChartValuesPoints from './model/generateChartValuesPoints'
import { createPath, updatePath, createText } from 'src/utils/svg'

const LEVELS = 5

const TEMPLATE = `
  <svg width="1000" height="1000" viewBox="0 0 1000 1000">
    <g transform="translate(500,500)">
    </g>
  </svg>
`

const createBaseChartPaths = ({ sides, radius }) =>
  [...Array(LEVELS)]
    .map((value, index) => (index + 1) * (radius / LEVELS))
    .map(aRadius => {
      const points = generateBaseChartPoints({ sides, radius: aRadius })
      return createPath(points, { role: 'chart-base' })
    })

const createChartValuesPath = ({ values, radius }) => {
  const point = generateChartValuesPoints({ values, radius })
  return createPath(point, { role: 'chart-values' })
}

const updateChartValuesPath = element => {
  const { values, radius } = element
  const valuesPath = element.querySelector('[role="chart-values"]')
  if (valuesPath) {
    updatePath(valuesPath, generateChartValuesPoints({ values, radius }))
  }
}

const createLabels = ({ labels, radius }) => {
  const points = generateBaseChartPoints({
    sides: labels.length,
    radius: radius * 1.2
  })

  return points.map((point, index) => {
    const { x, y } = point
    console.log(labels)
    return createText({
      text: labels[index],
      x,
      y
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
    return ['values']
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
    return [...Array(LEVELS)].map((value, index) => `Label ${index}`)
  }

  connectedCallback () {
    render(this)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'values') {
      updateChartValuesPath(this)
    }
  }
}

export default Chart
