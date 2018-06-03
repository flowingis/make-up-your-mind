import '@webcomponents/custom-elements'
import uuidv1 from 'uuid/v1'
import './components'
import radarData from './model/radarData'

if (!window.location.hash) {
  window.location.hash = uuidv1()
}

const channel = window.location.hash.substr(1)
let chart
let form

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

radarData.init(channel).then(initialData => {
  window.requestAnimationFrame(() => {
    form = document.querySelector('app-form')
    chart = document.querySelector('app-chart')

    syncChartToAnchor(chart)

    form.addEventListener('data-change', event => radarData.set(event.detail))
    form.addEventListener('add-row', radarData.addRow)
    form.addEventListener('remove-row', radarData.removeRow)
    form.addEventListener('reset', radarData.reset)
  })
})

const syncData = data => {
  chart.data = data
  form.data = data
  window.requestAnimationFrame(() => syncChartToAnchor(chart))
}

radarData.addOnChangeListener(syncData)
