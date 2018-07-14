import defaultData from './defaultData'
import firebaseClient from 'lib/firebaseClient'
import invariant from 'radar/utils/invariant'

export const factory = (firebaseClient, defaultData) => {
  let onMessageListeners = []
  let url

  const init = channel => {
    url = 'options-board/' + channel
    return get().then(data => {
      firebaseClient.onChange(url, onChange)
      return data
    })
  }

  const get = () => firebaseClient.get(url).then(data => data || defaultData)

  const onChange = data => {
    onMessageListeners.forEach(cb => {
      cb(data || defaultData)
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

  const reset = () => {
    set(defaultData)
    return defaultData
  }

  const addOnChangeListener = cb => {
    onMessageListeners = [...onMessageListeners, cb]
    return () => {
      onMessageListeners = onMessageListeners.filter(toCheck => toCheck !== cb)
    }
  }

  const validate = data => {
    invariant(data, 'data is undefined')
  }

  const set = data => {
    validate(data)
    return firebaseClient.set(url, data)
  }

  return {
    init,
    addOnChangeListener,
    set,
    get,
    addOption,
    removeOption,
    changePosition,
    reset
  }
}

export default factory(firebaseClient, defaultData)
