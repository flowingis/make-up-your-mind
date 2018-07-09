import './components'
import levers from './model/levers'

import { createAttributesObserver } from './utils/dom'
import { EVENTS } from './components/Chart/Chart'

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

const board = document.querySelector('app-chart')
board.data = levers.shuffle().get()

const onChangePosition = event => {
  const { name, coords } = event.detail
  board.data = levers.changePosition(name, coords).get()
}

window.requestAnimationFrame(() => {
  board.addEventListener(EVENTS.CHANGE_POSITION, onChangePosition)
  syncChartToAnchor(board)
})

createAttributesObserver(board, () => {
  syncChartToAnchor(board)
})
