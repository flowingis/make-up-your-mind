import { createText } from 'src/utils/svg'
import createBaseChartPoints from '../model/createBaseChartPoints'

const createLabels = ({ data, radius }) => {
  const labels = data.map(e => e.label)

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

export default createLabels
