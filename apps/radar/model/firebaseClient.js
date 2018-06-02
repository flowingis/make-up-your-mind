import firebase from 'firebase/app'
import 'firebase/database'

firebase.initializeApp({
  apiKey: FIREBASE_APP_KEY,
  databaseURL: 'https://make-up-your-mind.firebaseio.com'
})

const create = firebase => {
  let ref

  const getRef = url => {
    if (!ref) {
      ref = firebase.database().ref(url)
    }

    return ref
  }

  const get = url => {
    return getRef(url)
      .once('value')
      .then(data => data.val())
  }

  const set = (url, data) => {
    getRef(url).set(data)
  }

  const onChange = (url, cb) => {
    getRef(url).on('value', data => {
      cb(data.val())
    })
  }

  return {
    onChange,
    get,
    set
  }
}

export default create(firebase)
