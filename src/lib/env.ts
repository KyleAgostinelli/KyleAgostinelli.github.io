import { z } from 'zod'

const envSchema = z.object({
  FORMSPREE_ENDPOINT: z.url().optional(),
})

function undefinedIfBlank(value: string | undefined): string | undefined {
  return value && value.length > 0 ? value : undefined
}

// Parsed once at import time so a missing or malformed variable fails loudly at startup
// instead of silently at request time.
export const env = envSchema.parse({
  FORMSPREE_ENDPOINT: undefinedIfBlank(process.env.FORMSPREE_ENDPOINT),
})
