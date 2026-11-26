const CACHE_NAME = 'pamoora-wedding-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Network first, falling back to the last copy when offline.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Music streams in pieces (range requests); let those go straight to the network
  if (request.method !== 'GET' || request.headers.has('range')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200 && new URL(request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, copy))
            .catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('./'))),
  );
});
