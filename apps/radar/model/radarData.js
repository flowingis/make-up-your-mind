import firebase from 'firebase/app'
import 'firebase/database'

let onMessageListeners = []
let ref

const config = {
  apiKey: FIREBASE_APP_KEY,
  databaseURL: 'https://make-up-your-mind.firebaseio.com'
}

const init = channel =>
  new Promise(resolve => {
    firebase.initializeApp(config)
    ref = firebase.database().ref('radar/' + channel)

    ref.on('value', function (snapshot) {
      const data = snapshot.val()
      onMessageListeners.forEach(cb => {
        cb(data)
      })
    })

    resolve()
  })

const addOnMessageListener = cb => {
  onMessageListeners = [...onMessageListeners, cb]
  return () => {
    onMessageListeners = onMessageListeners.filter(toCheck => toCheck !== cb)
  }
}

const set = data => {
  ref.set(data)
}

const get = () => ref.once('value').then(data => data.val())

export default {
  init,
  addOnMessageListener,
  set,
  get
}
