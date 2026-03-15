import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      manifestFilename: 'manifest.webmanifest',
      useCredentials: true
    })
  ],
  server: {
    proxy: {
      // Matches the relative path in your axios config
      '/api/v1': {
        target: 'https://distinguished-dusty-mohamadarif346-d2688a41.koyeb.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  assetsInclude: ['**/*.lottie']
})