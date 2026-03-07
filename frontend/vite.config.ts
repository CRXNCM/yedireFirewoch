import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'https://backend.abolsolution.com',
        changeOrigin: true,
        secure: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['bootstrap', '@fortawesome/fontawesome-free', '@fortawesome/react-fontawesome', 'react-icons'],
          utils: ['axios', 'react-countup']
        }
      }
    },
    // Increase chunk size warning limit since the app is optimized
    chunkSizeWarningLimit: 1000
  }
})
