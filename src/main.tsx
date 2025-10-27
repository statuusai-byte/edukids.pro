import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Script de Limpeza de Service Worker
// Este código encontra e remove à força qualquer service worker antigo
// que possa estar "preso" no navegador, resolvendo o problema do PWA antigo.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (registrations.length > 0) {
      console.log('Service workers antigos encontrados. A remover...');
      let unregisterPromises = registrations.map(registration => registration.unregister());
      
      Promise.all(unregisterPromises).then(() => {
        console.log('Service workers antigos removidos com sucesso.');
        // Recarrega a página para garantir que o novo conteúdo seja carregado sem o cache antigo.
        window.location.reload();
      });
    }
  }).catch(function(err) {
    console.error('Falha ao remover o service worker antigo:', err);
  });
}

createRoot(document.getElementById("root")!).render(<App />);