import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
        'images/edukids-banner.png',
        'uploads/Captura_de_tela_2025-11-04_115828.png'
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webmanifest}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/\.well-known\//],
        skipWaiting: true,
        clientsClaim: true,
      },
      manifest: {
        // ID estável e único para o PWA (não usar start_url)
        id: "https://edukidsspro.vercel.app",
        name: "EDUKIDS+",
        short_name: "EDUKIDS",
        description: "Aprendizagem lúdica e interativa para crianças — explore atividades, trilhas de estudo, missões diárias e jogos educativos.",
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
            src: "/images/edukids-banner.png",
            type: "image/png",
            sizes: "1600x900",
            form_factor: "wide",
            label: "Tela inicial do EDUKIDS+"
          },
          {
            src: "/uploads/Captura_de_tela_2025-11-04_115828.png",
            type: "image/png",
            form_factor: "narrow",
            label: "Interface principal do app"
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
                type: "image/png"
              }
            ]
          },
          {
            name: "Play+ Trilhas",
            url: "/play-plus",
            icons: [
              {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png"
              }
            ]
          },
          {
            name: "Loja EDUKIDS+",
            url: "/store",
            icons: [
              {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png"
              }
            ]
          }
        ],
        launch_handler: {
          client_mode: "focus-existing"
        },
        handle_links: "preferred",
        prefer_related_applications: false,
        related_applications: [
          {
            platform: "play",
            id: "app.vercel.edukidsspro.twa"
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