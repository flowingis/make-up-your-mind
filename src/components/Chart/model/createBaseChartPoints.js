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

export default ({ sides, radius = 1, xOffset = 0, yOffset = 0 }) => {
  const angleIncrement = getAngleIncrement(sides)
  const startingAngle = gradToRadian(STARTING_ANGLES_IN_GRAD[sides] || 0)

  return newIndexedArray(sides)
    .map(unitaryCirclePoints(startingAngle, angleIncrement))
    .map(scalePoints(radius))
    .map(translatePoints(xOffset, yOffset))
    .map(floor)
}
