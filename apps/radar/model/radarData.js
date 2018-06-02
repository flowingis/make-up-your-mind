import firebase from 'firebase/app'
import 'firebase/database'
import defaultData from './defaultData'

let onMessageListeners = []
let ref

const addRow = () => {
  return get().then(data => {
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
  return get().then(data => {
    const newData = data.slice(0, -1)

    set(newData)

    return newData
  })
}

const config = {
  apiKey: FIREBASE_APP_KEY,
  databaseURL: 'https://make-up-your-mind.firebaseio.com'
}

const get = () =>
  ref.once('value').then(data => {
    return data.val() || defaultData
  })

const onValue = snapshot => {
  const data = snapshot.val()
  onMessageListeners.forEach(cb => {
    cb(data || defaultData)
  })
}

const init = channel => {
  firebase.initializeApp(config)
  ref = firebase.database().ref('radar/' + channel)

  return get().then(data => {
    ref.on('value', onValue)
    return data
  })
}

const addOnChangeListener = cb => {
  onMessageListeners = [...onMessageListeners, cb]
  return () => {
    onMessageListeners = onMessageListeners.filter(toCheck => toCheck !== cb)
  }
}

const set = data => {
  ref.set(data)
}

export default {
  init,
  addOnChangeListener,
  set,
  get,
  addRow,
  removeRow
}
