import './components'
import uuidv1 from 'uuid/v1'
import levers from './model/levers'

import { createAttributesObserver } from 'lib/utils/dom'
import { EVENTS } from './components/Chart/Chart'

if (!window.location.hash) {
  window.location.hash = uuidv1()
}

const channel = window.location.hash.substr(1)

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

let leversChart

const onChangePosition = event => {
  const { name, coords } = event.detail
  levers.changePosition(name, coords)
}

levers.init(channel).then(_ => {
  window.requestAnimationFrame(() => {
    leversChart = document.querySelector('app-chart')

    leversChart.addEventListener(EVENTS.CHANGE_POSITION, onChangePosition)

    createAttributesObserver(leversChart, () => {
      syncChartToAnchor(leversChart)
    })
  })
})

levers.addOnChangeListener(data => {
  leversChart.data = data
})

document.querySelector('button').addEventListener('click', levers.shuffle)
