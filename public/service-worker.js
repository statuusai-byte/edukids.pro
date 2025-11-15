/**
 * Lightweight fallback service worker
 * - Enables PWABuilder and validators to detect a service worker at the root URL.
 * - This file is intentionally minimal and safe: it claims clients and does not aggressively cache.
 * - The real Workbox-generated service worker (when built) may replace this at /service-worker.js.
 */

self.addEventListener('install', (event) => {
  // Activate immediately so validators can detect it right away
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      await self.clients.claim();
    } catch (e) {
      // ignore
    }
  })());
});

self.addEventListener('fetch', (event) => {
  // Minimal fetch handler: do nothing special, allow network requests as normal.
  // Keep the handler present so validators see a functioning service worker.
  // Avoid blocking or caching to prevent interfering with runtime behavior.
});