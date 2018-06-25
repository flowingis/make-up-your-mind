import { newIndexedArray } from 'radar/utils/array'
import { createPath } from 'radar/utils/svg'
import createBaseChartPoints from '../model/createBaseChartPoints'

const createBaseChart = ({ dataset, radius, levels }) => {
  const sides = dataset.length
  return newIndexedArray(levels)
    .map(index => (index + 1) * (radius / levels))
    .map(aRadius => {
      const points = createBaseChartPoints({ sides, radius: aRadius })
      return createPath(points, { role: 'chart-base' })
    })
}

export default createBaseChart
