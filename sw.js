/* Weather Tomorrow service worker — caches the app shell so the site
   works offline and can be installed. Live weather data is NEVER cached:
   all /api/* requests always go to the network. */
const CACHE_NAME = 'weather-tomorrow-v1';

const APP_SHELL = [
  '/',
 '/index.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/api.js',
  '/js/weather.js',
  '/js/search.js',
  '/js/ui.js',
  '/js/i18n.js',
  '/js/language.js',
  '/js/countries.js',
  '/pwa.js',
  '/manifest.webmanifest',
  '/images/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(APP_SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  var url = new URL(event.request.url);

  // Live weather / search / AQI data must always be fresh — never cache.
  if (url.pathname.indexOf('/api/') === 0) return;

  // Page navigations: try the network first, fall back to the cache offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(event.request, copy); });
        return res;
      }).catch(function () {
        return caches.match(event.request).then(function (r) { return r || caches.match('/'); });
      })
    );
    return;
  }

  // Static files (CSS, JS, images, manifest): cache first, then network.
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;
      return fetch(event.request).then(function (res) {
        if (res.ok && url.origin === self.location.origin) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put(event.request, copy); });
        }
        return res;
      });
    })
  );
});
