const version = '0.0.1'
const cacheName = `fcre-${version}`

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([`/`, `/index.html`, `/bundle.js`]).then(() => {
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
            .filter(key => !key.endsWith(version))
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
