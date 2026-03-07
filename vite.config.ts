import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://distinguished-dusty-mohamadarif346-d2688a41.koyeb.app', 
        changeOrigin: true, 
        secure: false, 
      }
    }
  }
})