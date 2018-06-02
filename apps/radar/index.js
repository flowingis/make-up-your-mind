import '@webcomponents/custom-elements'
import uuidv1 from 'uuid/v1'
import './components'
import radarData from './model/radarData'

if (!window.location.hash) {
  window.location.hash = uuidv1()
}

const channel = window.location.hash.substr(1)
let chart

radarData.init(channel)

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

window.requestAnimationFrame(() => {
  const form = document.querySelector('app-form')
  chart = document.querySelector('app-chart')

  chart.data = form.data
  syncChartToAnchor(chart)

  form.addEventListener('data-change', event => {
    chart.data = event.detail
    radarData.set(event.detail)
    window.requestAnimationFrame(() => syncChartToAnchor(chart))
  })
})

radarData.addOnMessageListener(data => {
  chart.data = data
})
