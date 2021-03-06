import {
  STARTING_ANGLES_IN_GRAD,
  unitaryCirclePoints,
  scalePoint,
  translatePoint,
  floor,
  getAngleIncrement,
  rotatePoint
} from 'radar/utils/chart'

import { newIndexedArray } from 'radar/utils/array'

export default ({ values, radius = 1, xOffset = 0, yOffset = 0 }) => {
  const sides = values.length
  const angleIncrement = getAngleIncrement(sides)
  const startingAngle = STARTING_ANGLES_IN_GRAD[sides] || 0

  return newIndexedArray(sides)
    .map(unitaryCirclePoints(angleIncrement))
    .map(rotatePoint(startingAngle))
    .map((point, index) => {
      const value = radius * values[index] / 100
      return scalePoint(value)(point)
    })
    .map(translatePoint(xOffset, yOffset))
    .map(floor)
}
