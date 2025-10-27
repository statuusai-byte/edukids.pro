import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => ({
  base: '/', // Adicionando base path explicitamente
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    dyadComponentTagger(), 
    react(),
    VitePWA({
      // Desabilitando o Service Worker temporariamente para isolar o erro 404 no Vercel
      strategies: 'injectManifest',
      injectManifest: {
        // Define um arquivo service worker vazio para desabilitar a funcionalidade
        // Isso garante que o Vercel não tente servir um Service Worker que possa estar causando o erro.
        src: 'public/sw.js',
        dest: 'sw.js',
        injectionPoint: undefined,
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'placeholder.svg'],
      manifest: {
        name: 'EduKids+',
        short_name: 'EduKids+',
        description: 'A plataforma onde a aprendizagem se transforma numa aventura emocionante.',
        theme_color: '#8b5cf6',
        background_color: '#0a0a0a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'placeholder.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: 'placeholder.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));