import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
    server: {
        proxy: {
            // Proxy calls starting with /api to your backend
            '/api': {
                target: 'http://localhost:4000',   // change to your backend URL
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path, // keep /api prefix
            }
        }
    }
})

