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
let data

radarData.init(channel)

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

const onDataChange = event => {
  data = event.detail
  chart.data = data
  radarData.set(data)
  window.requestAnimationFrame(() => syncChartToAnchor(chart))
}

const onAddClick = () => {
  const label = `Value ${data.length + 1}`
  data = [
    ...data,
    {
      label,
      values: {
        first: 20,
        second: 20
      }
    }
  ]

  chart.data = data
  form.data = data
  radarData.set(data)
  window.requestAnimationFrame(() => syncChartToAnchor(chart))
}

const onRemoveClick = () => {
  data = data.slice(0, -1)
  chart.data = data
  form.data = data
  radarData.set(data)
  window.requestAnimationFrame(() => syncChartToAnchor(chart))
}

window.requestAnimationFrame(() => {
  form = document.querySelector('app-form')
  chart = document.querySelector('app-chart')

  syncChartToAnchor(chart)

  form.addEventListener('data-change', onDataChange)
  form.addEventListener('add-row', onAddClick)
  form.addEventListener('remove-row', onRemoveClick)
})

radarData.addOnMessageListener(newData => {
  data = newData
  chart.data = data
  form.data = data
})
