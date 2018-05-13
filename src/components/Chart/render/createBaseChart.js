import { newIndexedArray } from 'src/utils/array'
import { createPath } from 'src/utils/svg'
import createBaseChartPoints from '../model/createBaseChartPoints'

const createBaseChart = ({ data, radius, levels }) => {
  const sides = data.length
  return newIndexedArray(levels)
    .map(index => (index + 1) * (radius / levels))
    .map(aRadius => {
      const points = createBaseChartPoints({ sides, radius: aRadius })
      return createPath(points, { role: 'chart-base' })
    })
}

export default createBaseChart
