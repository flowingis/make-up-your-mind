import { createText } from 'radar/utils/svg'
import createBaseChartPoints from '../model/createBaseChartPoints'

const createLabels = ({ dataset, radius }) => {
  const labels = dataset.map(e => e.label)

  const points = createBaseChartPoints({
    sides: labels.length,
    radius: radius * 1.25
  })

  return points.map((point, index) => {
    const { x, y } = point
    return createText({
      text: labels[index],
      x,
      y,
      attrs: {
        class: 'label'
      }
    })
  })
}

export default createLabels
