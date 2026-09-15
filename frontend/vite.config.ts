import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Local development only. Deployed, the site and the API share one origin,
    // so the app calls /api/... directly and this proxy is not involved.
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: false },
      '/health': { target: 'http://localhost:8000', changeOrigin: false },
    },
  },
})
