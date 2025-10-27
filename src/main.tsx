import { createRoot } from "react-dom/client";
import App from "./App";
import "./globals.css";

// Render normal da aplicação — o controle do service worker fica no ReloadPrompt / vite-plugin-pwa.
createRoot(document.getElementById("root")!).render(<App />);