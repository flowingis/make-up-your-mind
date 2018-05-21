import './components'
import './style/app.scss'

if ('serviceWorker' in navigator) {
  // Service worker registered
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker Registered')
  })
} else {
  // Service worker is not supported
}

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

window.requestAnimationFrame(() => {
  const form = document.querySelector('app-form')
  const chart = document.querySelector('app-chart')

  chart.data = form.data
  syncChartToAnchor(chart)

  form.addEventListener('data-change', event => {
    chart.data = event.detail
    window.requestAnimationFrame(() => syncChartToAnchor(chart))
  })
})
