import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@/components': path.resolve(rootDir, 'src/components'),
      '@/lib': path.resolve(rootDir, 'src/lib'),
      '@/content': path.resolve(rootDir, 'src/content'),
    },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', '.next', 'tests/e2e'],
  },
})
