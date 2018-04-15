import generateBaseChartPoints from './model/generateBaseChartPoints'
import generateChartPoints from './model/generateChartPoints'
import { generatePathAttribute } from './model/svgUtils'

const NS_URI = 'http://www.w3.org/2000/svg'

const generateEmptyChart = ({ sides, radius = 400, xOffset, yOffset }) => {
  const path = document.createElementNS(NS_URI, 'path')
  const points = generateBaseChartPoints({ sides, radius, xOffset, yOffset })

  path.setAttribute('d', generatePathAttribute(points))
  path.setAttribute('role', 'chart')

  return path
}

const generateValues = ({ sides, radius = 400, xOffset, yOffset }) => {
  const path = document.createElementNS(NS_URI, 'path')
  const values = []
  for (let i = 0; i < sides; i++) {
    const randomRangeValue = (Math.floor(Math.random() * 2) + 3) * 20
    values.push(randomRangeValue)
  }

  const points = generateChartPoints({ values, radius, xOffset, yOffset })

  console.log(generatePathAttribute(points))

  path.setAttribute('d', generatePathAttribute(points))
  path.setAttribute('role', 'values')

  return path
}

const onInputChange = value => {
  window.requestAnimationFrame(() => {
    const parent = document.querySelector('svg g')
    parent.innerHTML = ''
    parent.appendChild(
      generateEmptyChart({
        sides: value
      })
    )
    parent.appendChild(
      generateValues({
        sides: value
      })
    )
  })
}

onInputChange(5)

document.querySelector('input').addEventListener('input', event => {
  onInputChange(event.target.value)
})
