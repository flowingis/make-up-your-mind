import _shuffle from 'lodash.shuffle'
import sortBy from 'lodash.sortby'

export const BLOCKS_COORDS = [
  {
    x: 50.5,
    y: 68.967
  },
  {
    x: 50.5,
    y: 115.51
  },
  {
    x: 50.5,
    y: 163.134
  },
  {
    x: 50.5,
    y: 209.677
  }
]

const DEFAULT_DATA = ['quality', 'budget', 'scope', 'deadline']

const factory = (initialData = DEFAULT_DATA, coordinates = BLOCKS_COORDS) => {
  let data = [...initialData]

  let toReturn

  const get = () => Object.freeze(data)

  const shuffle = () => {
    data = _shuffle(data)
    return toReturn
  }
  const changePosition = (name, coords) => {
    let temporaryData = BLOCKS_COORDS.map((coords, i) => {
      return {
        coords,
        name: data[i]
      }
    })

    temporaryData = temporaryData.filter(element => element.name !== name)

    temporaryData.push({
      name,
      coords: coords
    })

    data = sortBy(temporaryData, 'coords.y').map(element => element.name)

    return toReturn
  }

  toReturn = {
    get,
    shuffle,
    changePosition
  }

  return toReturn
}

export default factory()
