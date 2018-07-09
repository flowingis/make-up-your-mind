import defaultData from './defaultData'
import firebaseClient from 'lib/firebaseClient'
import invariant from 'radar/utils/invariant'

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
    return get(url)
      .then(data => data || defaultData)
      .then(data => {
        const label = `Value ${data.dataset.length + 1}`
        const newData = {
          ...data,
          dataset: [
            ...data.dataset,
            {
              label,
              values: [20, 20]
            }
          ]
        }

        set(newData)

        return newData
      })
  }

  const reset = () => {
    set(defaultData)
    return defaultData
  }

  const removeRow = () => {
    return get(url)
      .then(data => data || defaultData)
      .then(data => {
        const newData = {
          ...data,
          dataset: data.dataset.slice(0, -1)
        }

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

  const validate = data => {
    invariant(data, 'data is undefined')
    invariant(
      data.series && Array.isArray(data.series),
      'series is not an array'
    )
    invariant(
      data.dataset && Array.isArray(data.dataset),
      'dataset not an array'
    )
    data.dataset.forEach(row => {
      invariant(row.values, 'row is not defined')
      invariant(Array.isArray(row.values), 'row is not an array')
    })
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
    addRow,
    removeRow,
    reset
  }
}

export default factory(firebaseClient, defaultData)
