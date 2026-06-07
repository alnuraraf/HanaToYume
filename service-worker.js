const CACHE_NAME = 'namitube-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/home.html',
  '/anime.html',
  '/watch.html',
  '/schedule.html',
  '/search.html',
  '/library.html',
  '/profile.html',
  '/donate.html',
  '/discover.html',
  '/spotlight.html',
  '/settings.html',
  '/community.html',
  '/news.html',
  '/offline.html',
  '/404.html',
  '/css/variables.css',
  '/css/reset.css',
  '/css/global.css',
  '/css/animations.css',
  '/css/skeleton.css',
  '/css/home.css',
  '/css/anime.css',
  '/css/watch.css',
  '/css/schedule.css',
  '/css/search.css',
  '/css/library.css',
  '/css/profile.css',
  '/css/donate.css',
  '/js/utils.js',
  '/js/api.js',
  '/js/storage.js',
  '/js/components.js',
  '/js/player.js',
  '/js/search.js',
  '/js/schedule.js',
  '/js/library.js',
  '/js/profile.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: stale-while-revalidate
  if (url.origin === 'https://api.jikan.moe') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cached);
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Static assets: cache first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
