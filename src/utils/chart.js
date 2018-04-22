export const STARTING_ANGLES_IN_GRAD = {
  3: -90,
  4: 45,
  5: -90,
  6: 0,
  7: -90,
  8: 22.5
}

export const gradToRadian = grad => grad * Math.PI / 180

export const getAngleIncrement = sides => 2 * Math.PI / sides

export const unitaryCirclePoints = (startingAngle, angleIncrement) => index => {
  const angle = startingAngle + angleIncrement * index

  const x = Math.cos(angle)
  const y = Math.sin(angle)

  return { x, y }
}

export const scalePoints = radius => point => ({
  x: radius * point.x,
  y: radius * point.y
})

export const translatePoints = (xOffset, yOffset) => point => ({
  x: xOffset + point.x,
  y: yOffset + point.y
})

export const floor = point => ({
  x: Math.floor(point.x),
  y: Math.floor(point.y)
})
