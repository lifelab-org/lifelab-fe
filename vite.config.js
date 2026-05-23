import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://15.165.101.8:8080',
        changeOrigin: true,
      },
    },
  },
})
