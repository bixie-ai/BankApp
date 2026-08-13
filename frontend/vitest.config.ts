import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  resolve: {
    alias: {
      '@/': path.resolve(import.meta.dirname, 'src') + '/',
      '@domain': path.resolve(import.meta.dirname, 'src/domain'),
      '@application': path.resolve(import.meta.dirname, 'src/application'),
      '@infrastructure': path.resolve(import.meta.dirname, 'src/infrastructure'),
      '@presentation': path.resolve(import.meta.dirname, 'src/presentation'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@lib': path.resolve(import.meta.dirname, 'src/lib'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    server: {
      deps: {
        inline: ['react', 'react-dom'],
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/__tests__/**/*.test.{ts,tsx}'],
          exclude: ['src/__tests__/integration/**'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['src/__tests__/integration/**/*.test.{ts,tsx}'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/index.ts', 'src/__tests__/**', 'src/mocks/**', 'src/test-setup.ts'],
    },
  },
})
