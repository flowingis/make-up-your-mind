import style from './Chart.component.css'
import createBaseChartPoints from './model/createBaseChartPoints'
import createChartValuesPoints from './model/createChartValuesPoints'
import { createPath, createText } from 'src/utils/svg'
import { newIndexedArray } from 'src/utils/array'
const COLORS = ['red', 'blue']

const getColor = index => {
  return COLORS[index % COLORS.length]
}

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

const createChartValuesPath = ({ values, radius, color }) => {
  const point = createChartValuesPoints({ values, radius })
  return createPath(point, {
    role: 'chart-values',
    fill: color,
    stroke: color
  })
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

const extractSeriesFromData = data => Object.keys(data[0].values)
const extractValuesFromData = (data, serie) =>
  data.map(dataRow => dataRow.values[serie])

const render = element => {
  element.innerHTML = TEMPLATE
  const { data, radius } = element

  if (!data || data.length === 0) {
    return
  }

  const sides = data.length
  const labels = data.map(e => e.label)

  const container = document.querySelector('svg g')

  const baseChartsPaths = createBaseChartPaths({
    sides,
    radius
  })

  baseChartsPaths.forEach(path => {
    container.appendChild(path)
  })

  const series = extractSeriesFromData(data)
  const seriesValues = series.map(serie => extractValuesFromData(data, serie))

  const chartElements = seriesValues.map((values, index) => {
    return createChartValuesPath({ values, radius, color: getColor(index) })
  })

  const labelElementes = createLabels({
    labels,
    radius
  })

  const items = [...chartElements, ...labelElementes]

  items.forEach(item => container.appendChild(item))
}

class Chart extends HTMLElement {
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
    window.requestAnimationFrame(() => render(this))
  }
}

export default Chart
