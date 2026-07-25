import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components': path.resolve(rootDir, 'src/components'),
      '@/lib': path.resolve(rootDir, 'src/lib'),
      '@/content': path.resolve(rootDir, 'src/content'),
    },
  },
  test: {
    // Pure logic lives in .test.ts and runs Node-only, which is faster and closer to how
    // route handlers and parsers actually execute. Component tests need a DOM; those files
    // opt into jsdom individually via a `// @vitest-environment jsdom` docblock instead of
    // flipping the whole suite over to it.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'tests/e2e'],
  },
})
