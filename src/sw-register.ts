/* Register the /sw.js service worker (a minimal worker placed in /public).
   We keep this registration independent from VitePWA's injected registration so tools can
   detect a top-level /sw.js and to ensure runtime registration when present. */

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      // Log the registration for debugging; silent in production
      console.log("ServiceWorker registered at:", registration.scope);

      // Listen for updates and act accordingly (basic)
      registration.addEventListener?.("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;
        newWorker.addEventListener?.("statechange", () => {
          if (newWorker.state === "installed") {
            // If there's an active controller, it's an update
            if (navigator.serviceWorker.controller) {
              console.log("New service worker installed. A refresh may be needed to activate it.");
            } else {
              console.log("Service worker installed for the first time.");
            }
          }
        });
      });
    } catch (err) {
      console.warn("ServiceWorker registration failed:", err);
    }
  });
}