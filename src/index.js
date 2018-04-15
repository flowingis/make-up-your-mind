const NS_URI = 'http://www.w3.org/2000/svg'

const STARTING_ANGLES_IN_GRAD = {
  3: -90,
  4: 45,
  5: -90,
  6: 0,
  7: -90,
  8: 22.5
}

const gradToRadian = grad => grad * Math.PI / 180

const generatePoints = ({ sides, radius = 500, xOffset = 0, yOffset = 0 }) => {
  const angleIncrement = 2 * Math.PI / sides
  let angle = gradToRadian(STARTING_ANGLES_IN_GRAD[sides] || 0)
  const points = []
  for (let i = 0; i < sides; i++) {
    const x = Math.floor(radius * Math.cos(angle))
    const y = Math.floor(radius * Math.sin(angle))
    angle += angleIncrement
    points.push({ x, y })
  }

  return points
}

const generatePoly = ({ sides, radius, xOffset, yOffset }) => {
  const path = document.createElementNS(NS_URI, 'path')
  const points = generatePoints({ sides, radius, xOffset, yOffset })

  let dPathAttribute = points.reduce((accumulator, point, index) => {
    return (
      accumulator + (index === 0 ? 'M' : 'L') + point.x + ' ' + point.y + ' '
    )
  }, '')

  dPathAttribute += 'z'

  path.setAttribute('d', dPathAttribute)
  path.setAttribute('fill-rule', 'evenodd')

  return path
}

const onInputChange = value => {
  window.requestAnimationFrame(() => {
    const parent = document.querySelector('svg g')
    parent.innerHTML = ''
    parent.appendChild(
      generatePoly({
        sides: value
      })
    )
  })
}

onInputChange(5)

document.querySelector('input').addEventListener('input', event => {
  onInputChange(event.target.value)
})
