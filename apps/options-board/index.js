import './style/index.scss'
import './components'
import { createAttributesObserver } from './utils/dom'

const syncChartToAnchor = board => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(board.innerHTML)}`
  })
}

const onAddClick = (board, label) => {
  const { data } = board

  board.data = [
    ...data,
    {
      label,
      x: 200,
      y: 400
    }
  ]
}

const onRemoveClick = board => {
  const newData = [...board.data]
  newData.pop()
  board.data = newData
}

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
    onAddClick(board, labelInput.value)
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
