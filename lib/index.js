import './style/app.scss'
if (!window.requestIdleCallback) {
  window.requestIdleCallback = cb => {
    const start = Date.now()
    return setTimeout(() => {
      const toReturn = {
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start))
        }
      }

      cb(toReturn)
    }, 1)
  }
}
