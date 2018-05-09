import './components'
import './style/app.css'

const RANGE_SELECTOR = 'input[role="chart-value-input"]'
const LABEL_SELECTOR = 'input[role="chart-label-input"]'

const getValueFromElements = selector => {
  return Array.from(document.querySelectorAll(selector)).map(
    input => input.value
  )
}

const updateChart = () => {
  const labels = getValueFromElements(LABEL_SELECTOR)

  const values = getValueFromElements(RANGE_SELECTOR).map(value =>
    parseInt(value, 10)
  )

  const data = labels.map((label, index) => ({
    label,
    value: values[index]
  }))

  const chart = document.querySelector('app-chart')

  chart.data = data
}

Array.from(document.querySelectorAll('input')).forEach(input => {
  input.addEventListener('input', () =>
    window.requestAnimationFrame(updateChart)
  )
})

window.requestAnimationFrame(updateChart)
