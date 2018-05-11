import './components'
import './style/app.css'

if ('serviceWorker' in navigator) {
  // Service worker registered
  navigator.serviceWorker.register('sw.js').then(() => {
    console.log('Service Worker Registered')
  })
} else {
  // Service worker is not supported
}

window.requestAnimationFrame(() => {
  const form = document.querySelector('app-form')
  const chart = document.querySelector('app-chart')

  chart.data = form.data

  form.addEventListener('data-change', event => {
    chart.data = event.detail
  })
})
