const appCaches = [
  {
    name: 'edomus-cache-img-v1',
    urls: [
      './assets/imgs/house.jpg',
      './assets/imgs/backyard.jpg',
      './assets/imgs/basement.jpg',
      './assets/imgs/bathroom.jpg',
      './assets/imgs/bedroom.jpg',
      './assets/imgs/kitchen.jpg',
      './assets/imgs/lounge.jpg',
      './assets/imgs/office.jpg',
      './assets/imgs/other.jpg',
      './assets/imgs/porch.jpg',
      './assets/imgs/ac.jpg',
      './assets/imgs/humidifier.jpg',
      './assets/imgs/light.jpg',
      './assets/imgs/img_cer.jpg',
      './assets/imgs/img_usermanual1.jpg',
      './assets/i18n/locale-en.json'
    ]
  }
]

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(Promise.all(
    appCaches.map(function (myCache) {
      return caches.open(myCache.name).then(function (cache) {
        return cache.addAll(myCache.urls);
      });
    })
  ));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});