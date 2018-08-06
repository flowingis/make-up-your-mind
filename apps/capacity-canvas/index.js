import './style/index.scss'
import './components'

import { createAttributesObserver } from 'lib/utils/dom'
import { EVENTS } from './components/Legend/Legend'
import markerToCanvasPostionData from './model/markerToCanvasPostionData'

let canvas
let legend

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

const onZoomInClick = () => {
  canvas.zoom *= 1.1
}

const onZoomOutClick = () => {
  let zoom = canvas.zoom / 1.1
  canvas.zoom = Math.max(1, zoom)
}

const onMarkerPositionChange = e => {
  const canvasDOMRect = canvas.getBoundingClientRect()
  const legendDOMRect = legend.getBoundingClientRect()

  const offset = markerToCanvasPostionData({
    markerX: e.detail.x,
    markerY: e.detail.y,
    canvasWidth: canvasDOMRect.width,
    canvasHeight: canvasDOMRect.height,
    legendWidth: legendDOMRect.width,
    legendHeight: legendDOMRect.height
  })

  canvas.offset = offset
}

const onAddClick = (canvas, label) => {
  const { data } = canvas

  canvas.data = [
    ...data,
    {
      label
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

  createAttributesObserver(canvas, () => {
    syncChartToAnchor(canvas)
  })

  syncChartToAnchor(canvas)
})
