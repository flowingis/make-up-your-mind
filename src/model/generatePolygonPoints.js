const STARTING_ANGLES_IN_GRAD = {
  3: -90,
  4: 45,
  5: -90,
  6: 0,
  7: -90,
  8: 22.5
}

const gradToRadian = grad => grad * Math.PI / 180

const emptyArray = size => [...Array(parseInt(size, 10))]

const unitaryCirclePoints = (startingAngle, angleIncrement) => (e, index) => {
  const angle = startingAngle + angleIncrement * index

  const x = Math.cos(angle)
  const y = Math.sin(angle)

  return { x, y }
}

const scalePoints = radius => point => ({
  x: radius * point.x,
  y: radius * point.y
})

const translatePoints = (xOffset, yOffset) => point => ({
  x: xOffset + point.x,
  y: yOffset + point.y
})

const floor = point => ({
  x: Math.floor(point.x),
  y: Math.floor(point.y)
})

const generatePoints = ({ sides, radius = 1, xOffset = 0, yOffset = 0 }) => {
  const angleIncrement = 2 * Math.PI / sides
  const startingAngle = gradToRadian(STARTING_ANGLES_IN_GRAD[sides] || 0)

  return emptyArray(sides)
    .map(unitaryCirclePoints(startingAngle, angleIncrement))
    .map(scalePoints(radius))
    .map(translatePoints(xOffset, yOffset))
    .map(floor)
}

export default generatePoints
