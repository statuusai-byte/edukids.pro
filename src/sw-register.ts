/* Register the /sw.js service worker (a minimal worker placed in /public).
   This registration uses feature detection instead of optional chaining so it behaves
   correctly in environments where certain DOM APIs may not be available. */

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      // Log the registration for debugging; silent in production
      console.log("ServiceWorker registered at:", registration.scope);

      // Prefer addEventListener but fall back to onupdatefound when not present
      if (typeof (registration as any).addEventListener === "function") {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          if (typeof (newWorker as any).addEventListener === "function") {
            (newWorker as any).addEventListener("statechange", () => {
              if ((newWorker as any).state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("New service worker installed. A refresh may be needed to activate it.");
                } else {
                  console.log("Service worker installed for the first time.");
                }
              }
            });
          } else if (typeof (newWorker as any).onstatechange !== "undefined") {
            (newWorker as any).onstatechange = () => {
              if ((newWorker as any).state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("New service worker installed. A refresh may be needed to activate it.");
                } else {
                  console.log("Service worker installed for the first time.");
                }
              }
            };
          }
        });
      } else if (typeof (registration as any).onupdatefound !== "undefined") {
        (registration as any).onupdatefound = () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          if (typeof (newWorker as any).onstatechange !== "undefined") {
            (newWorker as any).onstatechange = () => {
              if ((newWorker as any).state === "installed") {
                if (navigator.serviceWorker.controller) {
                  console.log("New service worker installed. A refresh may be needed to activate it.");
                } else {
                  console.log("Service worker installed for the first time.");
                }
              }
            };
          }
        };
      }
    } catch (err) {
      console.warn("ServiceWorker registration failed:", err);
    }
  });
}