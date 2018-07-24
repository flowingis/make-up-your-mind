if (!window.requestIdleCallback) {
  window.requestIdleCallback = cb => {
    const start = Date.now()
    return window.setTimeout(() => {
      const toReturn = {
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
      }

      cb(toReturn)
    }, 1)
  }
}

if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = id => {
    window.clearTimeout(id)
  }
}
