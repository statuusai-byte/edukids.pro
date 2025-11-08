import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";

// Render normal da aplicação — o controle do service worker fica no ReloadPrompt / vite-plugin-pwa.
const rootElement = typeof document !== "undefined" ? document.getElementById("root") : null;

if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  // Em alguns ambientes (tests/SSR) o elemento root pode não existir — logamos para facilitar o debug
  // e evitamos lançar um erro que interrompa o processo.
  // Caso você espere que o app sempre rode no browser, isto simplesmente impede um crash silencioso.
  // eslint-disable-next-line no-console
  console.error("Root element '#root' not found. Skipping React render.");
}