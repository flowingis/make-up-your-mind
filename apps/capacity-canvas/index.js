import './style/index.scss'
import './components'

import { createAttributesObserver } from 'lib/utils/dom'

const syncChartToAnchor = canvas => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(canvas.innerHTML)}`
  })
}

const onAddClick = (canvas, label) => {
  const { data } = canvas

  canvas.data = [
    ...data,
    {
      label,
      x: 200,
      y: 400
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
