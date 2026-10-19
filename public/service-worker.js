/*
 * Minimal service worker for the Saved Receipts PWA.
 *
 * Purpose: satisfy the installability requirement so Chrome/Android (and
 * desktop Chrome) offer "Install app" / "Add to Home Screen", and provide a
 * basic offline shell. It intentionally uses a network-first strategy with a
 * cache fallback so the prototype always serves the freshest build when online
 * (important for a demo that changes often) but still opens when offline.
 */

const CACHE_NAME = 'saved-receipts-pwa-v1';

// Derive the base path from the service worker's own location so this file is
// portable across deploy targets (GitHub Pages subpath, Elevate design bucket
// subpath, or root) without being hardcoded to any one URL. The SW is served
// from the prototype root, so its directory IS the base.
const BASE = self.location.pathname.replace(/service-worker\.js$/, '');

// Core shell resources worth pre-caching for an offline launch.
const PRECACHE_URLS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png',
  BASE + 'apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      // addAll fails the whole install if any URL 404s; add() each so one
      // missing asset doesn't block registration.
      .then((cache) => Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle same-origin GET navigations/assets. Let everything else
  // (POST, cross-origin, etc.) pass straight through to the network.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Update the cache in the background with the fresh response.
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(async () => {
        // Offline: serve from cache, falling back to the app shell for
        // navigations so client-side routing still works.
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          const shell = await caches.match(BASE + 'index.html');
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
