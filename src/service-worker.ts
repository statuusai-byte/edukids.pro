/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{
    url: string;
    revision: string;
  }>;
};

const STATIC_CACHE = "edukids-static-v1";
const IMAGES_CACHE = "edukids-images-v1";
const SUPABASE_CACHE = "edukids-supabase-v1";

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Network-first for navigation requests (HTML pages)
registerRoute(
  ({ request }) => request.mode === "navigate",
  new NetworkFirst({
    cacheName: STATIC_CACHE,
    networkTimeoutSeconds: 10,
    fetchOptions: {
      credentials: "same-origin",
    },
    matchOptions: {
      ignoreSearch: true,
    },
  })
);

// Styles and scripts - stale while revalidate
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "worker",
  new StaleWhileRevalidate({
    cacheName: `${STATIC_CACHE}-assets`,
  })
);

// Images - cache first with fallback
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: IMAGES_CACHE,
    matchOptions: {
      ignoreSearch: true,
    },
    fetchOptions: {
      credentials: "same-origin",
    },
  })
);

// Supabase requests - network first with fallback cache
registerRoute(
  ({ url }) => url.origin.includes("supabase.co"),
  new NetworkFirst({
    cacheName: SUPABASE_CACHE,
    networkTimeoutSeconds: 10,
  })
);

// Default handler to avoid uncached requests failing silently
setDefaultHandler(
  new StaleWhileRevalidate({
    cacheName: `${STATIC_CACHE}-fallback`,
  })
);

// Support skipWaiting from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});