import createChartValuesPoints from '../model/createChartValuesPoints'
import { createPath } from 'src/utils/svg'

const getColor = (colors, index) => {
  return colors[index % colors.length]
}

const extractSeriesFromData = data => Object.keys(data[0].values)

const extractValuesFromData = (data, serie) => {
  return data.map(dataRow => dataRow.values[serie])
}

const createValueChart = ({ values, radius, color }) => {
  const point = createChartValuesPoints({ values, radius })
  return createPath(point, {
    role: 'chart-values',
    fill: color,
    stroke: color
  })
}

const createValueCharts = ({ data, radius, colors }) => {
  const series = extractSeriesFromData(data)
  const seriesValues = series.map(serie => extractValuesFromData(data, serie))
  return seriesValues.map((values, index) =>
    createValueChart({ values, radius, color: getColor(colors, index) })
  )
}

export default createValueCharts
