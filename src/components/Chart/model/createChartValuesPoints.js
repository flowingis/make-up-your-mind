import {
  STARTING_ANGLES_IN_GRAD,
  gradToRadian,
  unitaryCirclePoints,
  scalePoints,
  translatePoints,
  floor,
  getAngleIncrement
} from 'src/utils/chart'

import { newIndexedArray } from 'src/utils/array'

export default ({ values, radius = 1, xOffset = 0, yOffset = 0 }) => {
  const sides = values.length
  const angleIncrement = getAngleIncrement(sides)
  const startingAngle = gradToRadian(STARTING_ANGLES_IN_GRAD[sides] || 0)

  return newIndexedArray(sides)
    .map(unitaryCirclePoints(startingAngle, angleIncrement))
    .map((point, index) => {
      const value = radius * values[index] / 100
      return scalePoints(value)(point)
    })
    .map(translatePoints(xOffset, yOffset))
    .map(floor)
}
