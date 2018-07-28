import { clamp } from 'lib/utils/numbers'

const calculateXBoundary = ({ nodeWidth, parentWidth }) => {
  return {
    min: 0,
    max: parentWidth - nodeWidth
  }
}

const calculateYBoundary = ({ nodeHeight, parentHeight }) => {
  return {
    min: 0,
    max: parentHeight - nodeHeight
  }
}

export default ({ x, y, nodeWidth, nodeHeight, parentWidth, parentHeight }) => {
  const xBoundary = calculateXBoundary({
    nodeWidth,
    parentWidth
  })

  const yBoundary = calculateYBoundary({
    nodeHeight,
    parentHeight
  })

  return {
    x: clamp(x, xBoundary.min, xBoundary.max),
    y: clamp(y, yBoundary.min, yBoundary.max)
  }
}
