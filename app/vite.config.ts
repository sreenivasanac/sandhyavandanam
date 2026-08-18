import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { APP } from './src/config.ts'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: APP.name,
        short_name: APP.shortName,
        description: APP.description,
        theme_color: APP.themeColor,
        background_color: APP.backgroundColor,
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,woff,ttf,json,webp}'],
        // chant clips are fetched on first play and then kept for offline use
        runtimeCaching: [{ urlPattern: /\/audio\/.*\.m4a$/, handler: 'CacheFirst', options: { cacheName: 'chants', expiration: { maxEntries: 400 } } }],
      },
    }),
  ],
})
