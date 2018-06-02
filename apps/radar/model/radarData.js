import defaultData from './defaultData'
import firebaseClient from './firebaseClient'

export const factory = (firebaseClient, defaultData) => {
  let onMessageListeners = []
  let url

  const init = channel => {
    url = 'radar/' + channel
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

  const addRow = () => {
    return get(url).then(data => {
      const label = `Value ${data.length + 1}`
      const newData = [
        ...data,
        {
          label,
          values: {
            first: 20,
            second: 20
          }
        }
      ]

      set(newData)

      return newData
    })
  }

  const removeRow = () => {
    return get(url).then(data => {
      const newData = data.slice(0, -1)

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

  const set = data => firebaseClient.set(url, data)

  return {
    init,
    addOnChangeListener,
    set,
    get,
    addRow,
    removeRow
  }
}

export default factory(firebaseClient, defaultData)
