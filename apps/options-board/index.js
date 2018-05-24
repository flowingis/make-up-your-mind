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

const onAddClick = board => {
  board.data = [
    ...board.data,
    {
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
  const addButton = document.querySelector('button[data-add]')
  const removeButton = document.querySelector('button[data-remove]')

  addButton.addEventListener('click', () => {
    onAddClick(board)
  })

  removeButton.addEventListener('click', () => {
    onRemoveClick(board)
  })

  createAttributesObserver(board, () => {
    syncChartToAnchor(board)
  })
})