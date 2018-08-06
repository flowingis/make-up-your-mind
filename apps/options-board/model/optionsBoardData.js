import firebaseClient from 'lib/firebaseClient'
import invariant from 'radar/utils/invariant'

const DEFAULT_DATA = []

export const factory = ({
  initialData = DEFAULT_DATA,
  realtimeDatabaseClient = firebaseClient
}) => {
  let onMessageListeners = []
  let url

  const init = channel => {
    url = 'options-board/' + channel
    return get().then(data => {
      realtimeDatabaseClient.onChange(url, onChange)
      return data
    })
  }

  const get = () =>
    realtimeDatabaseClient.get(url).then(data => data || initialData)

  const onChange = data => {
    onMessageListeners.forEach(cb => {
      cb(data || initialData)
    })
  }

  const changePosition = board => {
    set(board.data)
  }

  const addOption = (board, label) => {
    const { data } = board

    board.data = [
      ...data,
      {
        label,
        x: 200,
        y: 400
      }
    ]

    set(board.data)
  }

  const removeOption = board => {
    const newData = [...board.data]
    newData.pop()
    board.data = newData

    set(board.data)
  }

  const removeOptionByIndex = (board, i) => {
    const newData = [...board.data]
    newData.splice(i, 1)
    board.data = newData

    set(board.data)
  }

  const reset = () => {
    set(initialData)
    return initialData
  }

  const addOnChangeListener = cb => {
    onMessageListeners = [...onMessageListeners, cb]
    return () => {
      onMessageListeners = onMessageListeners.filter(toCheck => toCheck !== cb)
    }
  }

  const validate = data => {
    invariant(data, 'data is undefined')
    invariant(Array.isArray(data), 'label is not an array')
  }

  const set = data => {
    validate(data)
    return realtimeDatabaseClient.set(url, data)
  }

  return {
    init,
    addOnChangeListener,
    set,
    get,
    addOption,
    removeOption,
    removeOptionByIndex,
    changePosition,
    reset
  }
}

export default factory({})
