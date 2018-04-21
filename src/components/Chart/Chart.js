import generateBaseChartPoints from './model/generateBaseChartPoints'
import generateChartValuesPoints from './model/generateChartValuesPoints'
import { createPath } from 'src/utils/svgUtils'

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

class Chart extends HTMLElement {
  static get observedAttributes () {
    return ['values', 'radius']
  }

  get radius () {
    if (!this.hasAttribute('radius')) {
      return 400
    }
    return parseInt(this.getAttribute('radius'), 100)
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
    this.setAttribute(newValues.join(','))
  }

  connectedCallback () {
    this.innerHTML = TEMPLATE
    const { values, radius } = this

    if (values.length === 0) {
      return
    }

    const baseChartsPaths = createBaseChartPaths({
      sides: values.length,
      radius
    })

    const container = document.querySelector('svg g')
    baseChartsPaths.forEach(path => {
      container.appendChild(path)
    })

    container.appendChild(createChartValuesPath({ values, radius }))
  }
}

export default Chart
