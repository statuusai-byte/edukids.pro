import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
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
      registerType: "autoUpdate",
      injectRegister: "auto",
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
      manifest: {
        id: "/",
        name: "EDUKIDS+",
        short_name: "EDUKIDS",
        description:
          "Aprendizagem lúdica e interativa para crianças — explore atividades, trilhas de estudo, missões diárias e jogos educativos.",
        lang: "pt-BR",
        dir: "ltr",
        start_url: "/?source=pwa",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "fullscreen", "minimal-ui"],
        orientation: "portrait",
        theme_color: "#7c3aed",
        background_color: "#0f172a",
        categories: ["education", "kids", "games"],
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "/uploads/screenshot1.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label: "Tela de Atividades"
          },
          {
            src: "/uploads/screenshot2.png",
            sizes: "1080x2340",
            type: "image/png",
            form_factor: "narrow",
            label: "Tela de Lição"
          }
        ],
        shortcuts: [
          {
            name: "Atividades",
            url: "/activities",
            icons: [
              {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
          {
            name: "Play+ Trilhas",
            url: "/play-plus",
            icons: [
              {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png",
              },
            ],
          },
        ],
        launch_handler: {
          client_mode: "focus-existing",
        },
        handle_links: "preferred",
        prefer_related_applications: false,
        related_applications: [
          {
            platform: "play",
            id: "app.vercel.edukidsspro.twa",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));