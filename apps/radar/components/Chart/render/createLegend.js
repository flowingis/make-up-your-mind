import { createRect, createText } from 'radar/utils/svg'
import { flatten } from 'radar/utils/array'
const BLOCK_WIDTH = 50
const BLOCK_SPACING = 50

const getColor = (colors, index) => {
  return colors[index % colors.length]
}

export default ({ series, colors }) => {
  if (!series.length) {
    return
  }

  const items = series.map((label, index) => {
    const block = createRect({
      x: BLOCK_SPACING,
      y: index * (BLOCK_SPACING + BLOCK_WIDTH),
      width: BLOCK_WIDTH,
      height: BLOCK_WIDTH,
      color: getColor(colors, index),
      attrs: {
        'semi-trasparent': true
      }
    })

    const text = createText({
      text: label,
      x: BLOCK_SPACING + BLOCK_WIDTH + BLOCK_SPACING,
      y: BLOCK_WIDTH / 2 + index * (BLOCK_SPACING + BLOCK_WIDTH),
      attrs: {
        class: 'legend',
        'alignment-baseline': 'middle',
        'text-anchor': 'start'
      }
    })

    return [block, text]
  })

  return flatten(items)
}
