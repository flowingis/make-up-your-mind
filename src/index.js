import './components'

const updateChart = () => {
  const chart = document.querySelector('app-chart')

  const values = Array.from(document.querySelectorAll('input'))
    .map(input => input.value)
    .map(value => parseInt(value, 10))

  chart.values = values
}

Array.from(document.querySelectorAll('input')).forEach(input => {
  input.addEventListener('input', updateChart)
})

window.requestAnimationFrame(updateChart)
