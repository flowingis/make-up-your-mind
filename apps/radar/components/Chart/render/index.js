import style from './Chart.component.css'
import createBaseChart from './createBaseChart'
import createLabels from './createLabels'
import createValueCharts from './createValueCharts'

const TEMPLATE = `
    <svg viewBox="0 0 1000 1000" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <style>
            ${style.toString()}
        </style>
        <g transform="translate(500,500)">
        </g>
    </svg>
`

const COLORS = ['red', 'blue']

const LEVELS = 5

const render = (element, data, radius) => {
  element.innerHTML = TEMPLATE

  if (!data || data.length === 0) {
    return
  }

  const labelElementes = createLabels({
    data,
    radius
  })

  const baseChartsPaths = createBaseChart({
    data,
    radius,
    levels: LEVELS
  })

  const valueCharts = createValueCharts({
    data,
    radius,
    colors: COLORS
  })

  const items = [...labelElementes, ...baseChartsPaths, ...valueCharts]

  const container = document.querySelector('svg g')

  items.forEach(item => container.appendChild(item))
}

export default render
