/**
 * Islamic Studies Family LMS - Zero-Cache PWA Service Worker
 * Enables PWA installability ("Add to Home Screen") while guaranteeing 100% fresh network delivery.
 */

// Install immediately without waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate immediately and purge any stale legacy caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`[PWA ServiceWorker] Purging legacy cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Transparent network pass-through required for PWA installability criteria
self.addEventListener('fetch', (event) => {
  // Always fetch directly from network without caching
  event.respondWith(
    fetch(event.request).catch((err) => {
      // If network fails completely and user is offline, return basic network error
      console.warn('[PWA ServiceWorker] Network request failed:', event.request.url);
      throw err;
    })
  );
});
