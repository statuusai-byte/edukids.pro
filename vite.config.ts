import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => ({
  base: "/", // Garantindo que o caminho base seja a raiz
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "script", // Gera um script de registro para usarmos manualmente
      manifest: {
        id: "https://edukidspro.vercel.app/",
        name: "EDUKIDS+",
        short_name: "EDUKIDS+",
        description: "Aprenda brincando! Jogos educativos, trilhas de estudo e missões diárias para crianças de 4 a 12 anos.",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#7c3aed",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/uploads/screenshot-mobile-1.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label: "Tela de Atividades",
          },
          {
            src: "/uploads/screenshot-mobile-2.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label: "Página de uma Lição",
          },
          {
            src: "/uploads/screenshot-mobile-3.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label: "Loja Premium e de Dicas",
          },
          {
            src: "/uploads/screenshot-mobile-4.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label: "Painel dos Pais",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/\.well-known\//],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/eylmcfxdbwqbmfubojty\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 semana
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 dias
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));