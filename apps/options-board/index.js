import './style/index.scss'
import './components'
import uuidv1 from 'uuid/v1'
import optionsBoardData from './model/optionsBoardData'
import { createAttributesObserver } from './utils/dom'

if (!window.location.hash) {
  window.location.hash = uuidv1()
}

const channel = window.location.hash.substr(1)
const syncChartToAnchor = board => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(board.innerHTML)}`
  })
}

const onRemoveClick = board => {
  const newData = [...board.data]
  newData.pop()
  board.data = newData
}

optionsBoardData.init(channel).then(_ => {
  window.requestAnimationFrame(() => {
    const board = document.querySelector('app-board')
    const labelInput = document.querySelector('input')
    const addButton = document.querySelector('button[data-add]')
    const removeButton = document.querySelector('button[data-remove]')
    const toggleButton = document.querySelector('button[data-toggle-legend]')

    toggleButton.addEventListener('click', () => {
      board.showLegend = !board.showLegend
    })

    addButton.addEventListener('click', () => {
      if (!labelInput.value) {
        return
      }
      optionsBoardData.addOption(board, labelInput.value)
      labelInput.value = ''
    })

    removeButton.addEventListener('click', () => {
      onRemoveClick(board)
    })

    createAttributesObserver(board, () => {
      syncChartToAnchor(board)
    })

    syncChartToAnchor(board)
  })
})
