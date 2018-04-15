import generatePolygonPoints from './model/generatePolygonPoints'

const NS_URI = 'http://www.w3.org/2000/svg'

const generatePoly = ({ sides, radius = 400, xOffset, yOffset }) => {
  const path = document.createElementNS(NS_URI, 'path')
  const points = generatePolygonPoints({ sides, radius, xOffset, yOffset })

  let dPathAttribute = points.reduce((accumulator, point, index) => {
    return (
      accumulator + (index === 0 ? 'M' : 'L') + point.x + ' ' + point.y + ' '
    )
  }, '')

  dPathAttribute += 'z'

  path.setAttribute('d', dPathAttribute)
  path.setAttribute('role', 'chart')

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
