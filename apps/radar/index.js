import '@webcomponents/custom-elements'
import uuidv1 from 'uuid/v1'
import './components'
import radarData from './model/radarData'
import { EVENTS } from './components/Form/Form'

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

const onToggleShowLegend = checkbox => {
  if (!chart) {
    return
  }

  chart.hideLegend = !checkbox.checked
}

radarData.init(channel).then(_ => {
  window.requestAnimationFrame(() => {
    form = document.querySelector('app-form')
    chart = document.querySelector('app-chart')

    syncChartToAnchor(chart)

    form.addEventListener(EVENTS.DATA_CHANGE, event =>
      radarData.set(event.detail)
    )
    form.addEventListener(EVENTS.ADD_ROW, radarData.addRow)
    form.addEventListener(EVENTS.REMOVE_ROW, radarData.removeRow)
    form.addEventListener(EVENTS.RESET, radarData.reset)

    document
      .querySelector('input[type="checkbox"')
      .addEventListener('change', e => onToggleShowLegend(e.target))
  })
})

const syncData = data => {
  chart.data = data
  form.data = data
  window.requestAnimationFrame(() => syncChartToAnchor(chart))
}

radarData.addOnChangeListener(syncData)
