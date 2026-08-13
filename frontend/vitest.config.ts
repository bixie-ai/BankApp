import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  resolve: {
    alias: {
      '@domain': path.resolve(import.meta.dirname, 'src/domain'),
      '@application': path.resolve(import.meta.dirname, 'src/application'),
      '@infrastructure': path.resolve(import.meta.dirname, 'src/infrastructure'),
      '@presentation': path.resolve(import.meta.dirname, 'src/presentation'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['react', 'react-dom'],
      },
    },
  },
})
