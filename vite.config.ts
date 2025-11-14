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
      strategies: "injectManifest",
      srcDir: "src",
      filename: "service-worker.ts",
      registerType: "prompt",
      injectRegister: false,
      includeAssets: [
        "favicon.ico",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "images/edukids-banner.png"
      ],
      manifest: {
        name: "EDUKIDS+",
        short_name: "EDUKIDS+",
        id: "urn:edukidsspro:app",
        lang: "pt-BR",
        dir: "ltr",
        description: "Aprenda brincando! Jogos educativos, trilhas de estudo e missões diárias para crianças de 4 a 12 anos.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "fullscreen"],
        orientation: "portrait-primary",
        background_color: "#0f172a",
        theme_color: "#7c3aed",
        categories: ["education", "games", "kids"],
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        shortcuts: [
          {
            name: "Atividades",
            short_name: "Estudar",
            description: "Ir direto para as atividades por faixa etária.",
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
            name: "Play+ Missões",
            short_name: "Play+",
            description: "Abrir as trilhas Play+ e missões diárias.",
            url: "/play-plus",
            icons: [
              {
                src: "/icons/icon-192.png",
                sizes: "192x192",
                type: "image/png"
              }
            ]
          }
        ],
        screenshots: [
          {
            src: "/uploads/screenshot-mobile-1.png",
            sizes: "1080x1920",
            type: "image/png",
            platform: "mobile",
            label: "Tela inicial de atividades"
          },
          {
            src: "/uploads/screenshot-mobile-2.png",
            sizes: "1080x1920",
            type: "image/png",
            platform: "mobile",
            label: "Página de lição e quiz"
          },
          {
            src: "/uploads/screenshot-mobile-3.png",
            sizes: "1080x1920",
            type: "image/png",
            platform: "mobile",
            label: "Painel dos Pais"
          },
          {
            src: "/uploads/screenshot-mobile-4.png",
            sizes: "1080x1920",
            type: "image/png",
            platform: "mobile",
            label: "Loja Premium"
          }
        ]
      },
      devOptions: {
        enabled: true,
        suppressWarnings: true,
        navigateFallback: "index.html",
        type: "module"
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));