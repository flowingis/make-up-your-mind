import shuffle from 'lodash.shuffle'
import './components'

import { createAttributesObserver } from './utils/dom'

const syncChartToAnchor = chart => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(chart.innerHTML)}`
  })
}

const board = document.querySelector('app-chart')
board.data = shuffle(['quality', 'budget', 'scope', 'deadline'])

createAttributesObserver(board, () => {
  syncChartToAnchor(board)
})

window.requestAnimationFrame(() => {
  syncChartToAnchor(board)
})
