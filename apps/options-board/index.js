import './style/index.scss'
import './components'
import uuidv1 from 'uuid/v1'
import optionsBoardData from './model/optionsBoardData'
import { createAttributesObserver } from 'lib/utils/dom'
import { EVENTS } from './components/Board/Board'

if (!window.location.hash) {
  window.location.hash = uuidv1()
}

const channel = window.location.hash.substr(1)
let board

const removePostit = e => {
  const indexToRemove = e.target.getAttribute('data-remove-by-index')
  optionsBoardData.removeOptionByIndex(board, indexToRemove)
}

const syncChart = board => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(board.innerHTML)}`
  })

  const removeByIndexButtons = document.querySelectorAll(
    'text[data-remove-by-index]'
  )

  removeByIndexButtons.forEach((deleteButton, i) => {
    if (deleteButton.getAttribute('listner-added') === 'false') {
      deleteButton.setAttribute('listner-added', 'true')
      deleteButton.addEventListener('click', removePostit)
    }
  })
}

optionsBoardData.init(channel).then(_ => {
  window.requestAnimationFrame(() => {
    board = document.querySelector('app-board')
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
      optionsBoardData.removeOption(board)
    })

    board.addEventListener(EVENTS.CHANGE_POSITION, () => {
      optionsBoardData.changePosition(board)
    })

    createAttributesObserver(board, () => {
      syncChart(board)
    })
  })
})

const syncData = data => {
  board.data = data
  window.requestAnimationFrame(() => syncChart(board))
}

optionsBoardData.addOnChangeListener(syncData)
