/**
 * Islamic Studies LMS - Kill-Switch Service Worker
 * This service worker replaces the old PWA caching service worker.
 * Its only job is to immediately unregister itself and clear all existing caches
 * so that the app runs fully online and always fetches fresh assets.
 */

self.addEventListener('install', (event) => {
  // Skip waiting to immediately replace any old service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`[Kill-Switch SW] Deleting legacy cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Unregister this service worker
      self.registration.unregister().then((success) => {
        if (success) {
          console.log('[Kill-Switch SW] Successfully unregistered legacy service worker.');
        }
      });
      return self.clients.claim();
    })
  );
});

// We don't intercept fetch events anymore, but we need the handler to satisfy PWA requirements if manifest is still present
self.addEventListener('fetch', (event) => {
  // Do nothing, let the browser handle the fetch normally
});
