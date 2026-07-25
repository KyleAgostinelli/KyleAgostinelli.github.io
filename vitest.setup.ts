import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// Runs for every test file, including plain-node ones with no DOM at all - guard so cleanup()
// doesn't reach for a `document` that was never created.
afterEach(() => {
  if (typeof document !== 'undefined') {
    cleanup()
  }
})
