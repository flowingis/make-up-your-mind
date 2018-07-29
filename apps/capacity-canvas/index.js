import './style/index.scss'
import './components'

import { createAttributesObserver } from 'lib/utils/dom'
import { EVENTS } from './components/Legend/Legend'

let canvas
let legend

const syncChartToAnchor = canvas => {
  window.requestIdleCallback(() => {
    document.querySelector(
      'a'
    ).href = `data:image/svg+xml;base64,\n${window.btoa(canvas.innerHTML)}`
  })
}

const onLeftClick = () => {
  const container = document.querySelector('app-capacity-canvas')
  container.style.left = `${container.getBoundingClientRect().left + 100}px`
}

const onRightClick = () => {
  const container = document.querySelector('app-capacity-canvas')
  container.style.left = `${container.getBoundingClientRect().left - 100}px`
}

const onZoomInClick = () => {
  const canvas = document.querySelector('app-capacity-canvas')
  canvas.zoom *= 1.1
}

const onZoomOutClick = () => {
  const canvas = document.querySelector('app-capacity-canvas')
  canvas.zoom /= 1.1
}

const onMarkerPositionChange = e => {
  canvas.offset = e.detail
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
  canvas = document.querySelector('app-capacity-canvas')
  legend = document.querySelector('app-legend')
  const labelInput = document.querySelector('input')
  const addButton = document.querySelector('button[data-add]')
  const removeButton = document.querySelector('button[data-remove]')
  const zoomInButton = document.querySelector('button[data-zoom-in]')
  const zoomOutButton = document.querySelector('button[data-zoom-out]')
  const leftButton = document.querySelector('button[data-left]')
  const rightButton = document.querySelector('button[data-right]')

  legend.addEventListener(
    EVENTS.MARKER_POSITION_CHANGE,
    onMarkerPositionChange
  )

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

  zoomInButton.addEventListener('click', () => {
    onZoomInClick()
  })

  zoomOutButton.addEventListener('click', () => {
    onZoomOutClick()
  })

  leftButton.addEventListener('click', () => {
    onLeftClick()
  })

  rightButton.addEventListener('click', () => {
    onRightClick()
  })

  createAttributesObserver(canvas, () => {
    syncChartToAnchor(canvas)
  })

  syncChartToAnchor(canvas)
})
