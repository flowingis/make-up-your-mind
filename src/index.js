import './components'
import './style/app.css'

const updateChart = () => {
  const chart = document.querySelector('app-chart')
  const values = Array.from(
    document.querySelectorAll('input[role="chart-value-input"')
  )
    .map(input => input.value)
    .map(value => parseInt(value, 10))

  chart.values = values
}

Array.from(document.querySelectorAll('input[role="chart-value-input"')).forEach(
  input => {
    input.addEventListener('input', updateChart)
  }
)

window.requestAnimationFrame(updateChart)
