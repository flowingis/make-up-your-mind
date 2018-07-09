import firebaseClient from 'lib/firebaseClient'
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

export const factory = ({
  initialData = DEFAULT_DATA,
  coordinates = BLOCKS_COORDS,
  realtimeDatabaseClient = firebaseClient
}) => {
  let onMessageListeners = []
  let url

  const init = channel => {
    url = 'levers/' + channel
    return get().then(data => {
      realtimeDatabaseClient.onChange(url, onChange)
      return data
    })
  }

  const get = () =>
    realtimeDatabaseClient.get(url).then(data => data || [...initialData])

  const set = data => {
    return realtimeDatabaseClient.set(url, data)
  }

  const onChange = data => {
    onMessageListeners.forEach(cb => {
      cb(data || [...initialData])
    })
  }

  const shuffle = () => {
    return get().then(data => {
      const newData = _shuffle(data)

      set(newData)

      return newData
    })
  }

  const changePosition = (name, coords) => {
    return get().then(data => {
      let temporaryData = coordinates.map((coords, i) => {
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

      const newData = sortBy(temporaryData, 'coords.y').map(
        element => element.name
      )

      set(newData)

      return newData
    })
  }

  const addOnChangeListener = cb => {
    onMessageListeners = [...onMessageListeners, cb]
    return () => {
      onMessageListeners = onMessageListeners.filter(toCheck => toCheck !== cb)
    }
  }

  return {
    init,
    addOnChangeListener,
    shuffle,
    changePosition
  }
}

export default factory({})
