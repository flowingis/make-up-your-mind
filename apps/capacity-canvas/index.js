import './style/index.scss'
import './components'

import { createAttributesObserver } from 'lib/utils/dom'

const syncChartToAnchor = canvas => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(canvas.innerHTML)}`
  })

  const removeByIndexButtons = document.querySelectorAll(
    'text[data-remove-by-index]'
  )
  removeByIndexButtons.forEach((deleteButton, i) => {
    if (deleteButton.getAttribute('listner-added') === 'false') {
      deleteButton.setAttribute('listner-added', 'true')
      deleteButton.addEventListener('click', e => onRemoveItemClick(e, canvas))
    }
  })
}

const onRemoveItemClick = (e, canvas) => {
  const newData = [...canvas.data]
  const indexToRemove = e.target.getAttribute('data-remove-by-index')
  newData.splice(indexToRemove, 1)
  canvas.data = newData
}

const onAddClick = (canvas, label) => {
  const { data } = canvas

  canvas.data = [
    ...data,
    {
      label,
      x: 100,
      y: 75
    }
  ]
}

const onRemoveClick = canvas => {
  const newData = [...canvas.data]
  newData.pop()
  canvas.data = newData
}

window.requestAnimationFrame(() => {
  const canvas = document.querySelector('app-capacity-canvas')
  const labelInput = document.querySelector('input')
  const addButton = document.querySelector('button[data-add]')
  const removeButton = document.querySelector('button[data-remove]')

  addButton.addEventListener('click', () => {
    if (!labelInput.value) {
      return
    }
    onAddClick(canvas, labelInput.value)
    labelInput.value = ''
  })

  removeButton.addEventListener('click', () => {
    onRemoveClick(canvas)
  })

  createAttributesObserver(canvas, () => {
    syncChartToAnchor(canvas)
  })

  syncChartToAnchor(canvas)
})
