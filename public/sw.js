/**
 * Islamic Studies Family LMS - Resilient Offline-Ready Service Worker
 * Features:
 * - Cache-first for curriculum JSON modules & manifests
 * - Stale-while-revalidate for CSS, JS, fonts, and HTML app shell
 * - Network-only for dynamic API mutations
 */

const CACHE_NAME = 'islamic-studies-vmtpsq5a9';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/modules_manifest.json',
  '/manifest.json',
  '/icons/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 1. Precache Core Shell Assets on Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn('[ServiceWorker] Precache notice:', err);
        return self.skipWaiting();
      })
  );
});

// 2. Clean up Old Caches on Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              console.log(`[ServiceWorker] Purging legacy cache: ${name}`);
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// 3. Intelligent Fetch Routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-http schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Network-only for API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            JSON.stringify({ success: false, error: 'Offline - Unable to connect to server.' }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
          )
      )
    );
    return;
  }

  // Cache-first for Course Data chunks and Manifest
  if (
    url.pathname.startsWith('/course_data/') ||
    url.pathname.endsWith('course_data.json') ||
    url.pathname.endsWith('modules_manifest.json')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Revalidate in background
          fetch(request)
            .then((res) => {
              if (res.ok) {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
              }
            })
            .catch(() => {});
          return cached;
        }
        return fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate for Static Assets & Navigation Shell
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        })
        .catch((err) => {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('/index.html') || caches.match('/');
          }
          throw err;
        });
      return cached || fetchPromise;
    })
  );
});
