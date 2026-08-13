import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@domain': path.resolve(import.meta.dirname, 'src/domain'),
      '@application': path.resolve(import.meta.dirname, 'src/application'),
      '@infrastructure': path.resolve(import.meta.dirname, 'src/infrastructure'),
      '@presentation': path.resolve(import.meta.dirname, 'src/presentation'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@lib': path.resolve(import.meta.dirname, 'src/lib'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/bank-api': {
        target: 'http://localhost:8989',
        changeOrigin: true,
      },
    },
  },
})
