import {
  STARTING_ANGLES_IN_GRAD,
  unitaryCirclePoints,
  scalePoint,
  translatePoint,
  floor,
  getAngleIncrement,
  rotatePoint
} from 'src/utils/chart'

import { newIndexedArray } from 'src/utils/array'

export default ({ sides, radius = 1, xOffset = 0, yOffset = 0 }) => {
  const angleIncrement = getAngleIncrement(sides)
  const startingAngle = STARTING_ANGLES_IN_GRAD[sides] || 0

  return newIndexedArray(sides)
    .map(unitaryCirclePoints(angleIncrement))
    .map(rotatePoint(startingAngle))
    .map(scalePoint(radius))
    .map(translatePoint(xOffset, yOffset))
    .map(floor)
}
