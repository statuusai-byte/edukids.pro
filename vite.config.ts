import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(),
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: null,
      manifest: {
        name: "EDUKIDS+",
        short_name: "EDUKIDS+",
        description: "Explore atividades, cursos e jogos educativos para crianças — Aprender nunca foi tão divertido.",
        start_url: "/",
        display: "standalone",
        background_color: "#0f172a",
        theme_color: "#7c3aed",
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        screenshots: [
          {
            src: "/uploads/screenshot1.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label": "Tela de Atividades"
          },
          {
            src: "/uploads/screenshot2.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label": "Tela de Lição Interativa"
          }
        ],
        shortcuts: [
          {
            name: "Atividades",
            short_name: "Atividades",
            url: "/activities",
            icons: [{ "src": "/icons/icon-192.png", "sizes": "192x192" }]
          },
          {
            name: "Play+",
            short_name: "Play+",
            url: "/play-plus",
            icons: [{ "src": "/icons/icon-192.png", "sizes": "192x192" }]
          },
          {
            name: "Loja",
            short_name: "Loja",
            url: "/store",
            icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192" }]
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/\.well-known\//],
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
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}));