import get from 'lodash.get'
import style from './Chart.component.css'
import createBaseChart from './createBaseChart'
import createLabels from './createLabels'
import createValueCharts from './createValueCharts'
import createLegend from './createLegend'

const TEMPLATE = `
    <svg viewBox="0 0 1000 1200" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <style>
            ${style.toString()}
        </style>
        <g data-chart transform="translate(500,500)">
        </g>
        <g data-legend transform="translate(0,1000)">
        </g>
    </svg>
`

const COLORS = ['red', 'blue']

const LEVELS = 5

const render = (element, data, radius) => {
  element.innerHTML = TEMPLATE
  const dataset = get(data, 'dataset', [])
  if (dataset.length === 0) {
    return
  }

  const labelElementes = createLabels({
    dataset,
    radius
  })

  const baseChartsPaths = createBaseChart({
    dataset,
    radius,
    levels: LEVELS
  })

  const valueCharts = createValueCharts({
    dataset,
    radius,
    colors: COLORS
  })

  const chartElements = [...labelElementes, ...baseChartsPaths, ...valueCharts]

  const chartContainer = document.querySelector('svg g[data-chart]')

  chartElements.forEach(item => chartContainer.appendChild(item))

  const legendContainer = document.querySelector('svg g[data-legend]')

  const series = get(data, 'series', [])

  createLegend({
    series,
    colors: COLORS
  }).forEach(item => legendContainer.appendChild(item))
}

export default render
