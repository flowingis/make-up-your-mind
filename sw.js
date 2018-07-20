const VERSION = '0.4.0'
const CACHE_NAME = `make-up-your-mind-${VERSION}`

const CACHABLE_ELEMENTS = [
  '/',
  '/manifest.json',
  '/icon.png',
  '/index.html',
  '/capacity-canvas.html',
  '/capacity.bundle.js',
  '/radar.html',
  '/radar.bundle.js',
  '/board.html',
  '/board.bundle.js',
  '/levers.html',
  '/levers.bundle.js',
  '/lib.bundle.js'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHABLE_ELEMENTS).then(() => {
        console.log('WORKER:: install completed')
      })
    })
  )
})

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => !key.endsWith(VERSION))
            .map(key => caches.delete(key))
        )
      )
      .then(() => {
        console.log(
          'WORKER:: activation completed. This is not even my final form'
        )
      })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  )
})
