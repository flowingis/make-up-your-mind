import './components'
import './style/app.css'

window.requestAnimationFrame(() => {
  const form = document.querySelector('app-form')
  const chart = document.querySelector('app-chart')

  chart.data = form.data

  form.addEventListener('data-change', event => {
    chart.data = event.detail
  })
})
