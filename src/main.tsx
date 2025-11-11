import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";
import { registerSW } from "virtual:pwa-register";

// Registra o Service Worker
registerSW({ immediate: true });

// Render normal da aplicação
const rootElement = typeof document !== "undefined" ? document.getElementById("root") : null;

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  // Em alguns ambientes (tests/SSR) o elemento root pode não existir
  // eslint-disable-next-line no-console
  console.error("Root element '#root' not found. Skipping React render.");
}