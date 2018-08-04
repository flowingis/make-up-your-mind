import nodeFactory from './nodeFactory'

const HEIGHT = 76
const WIDTH = 127
const DIMENSION_RATIO = WIDTH / HEIGHT
const DEFAULT_COLOR = '#E4EF49'

export const getPostItHeight = width => width / DIMENSION_RATIO

const factory = postItFactory => initialData => {
  const toReturn = {}

  let data = {
    width: WIDTH,
    height: HEIGHT,
    color: DEFAULT_COLOR,
    ...initialData
  }

  toReturn.withWidth = width => {
    data = {
      ...data,
      width,
      height: getPostItHeight(width)
    }

    return toReturn
  }

  toReturn.withHeight = height => {
    data = {
      ...data,
      height,
      width: DIMENSION_RATIO / height
    }

    return toReturn
  }

  toReturn.withColor = color => {
    data = {
      ...data,
      color
    }
  }

  toReturn.create = ({ x, y, index, label, color }) => {
    const realColor = color || data.color
    return postItFactory({ x, y, index, label, ...data, color: realColor })
  }

  return toReturn
}

export default factory(nodeFactory)
