import { z } from 'zod'

// Deliberately lenient: only the fields this tool actually reads are required. A real HAR
// export has many more fields (cache, cookies, postData, page timings...) that this tool
// doesn't need and shouldn't fail on.
const harHeaderSchema = z.object({
  name: z.string(),
  value: z.string(),
})

const harRequestSchema = z.object({
  method: z.string(),
  url: z.string(),
  headers: z.array(harHeaderSchema).default([]),
})

const harResponseSchema = z.object({
  status: z.number(),
  statusText: z.string().default(''),
  headers: z.array(harHeaderSchema).default([]),
  redirectURL: z.string().default(''),
})

const harTimingsSchema = z
  .object({
    wait: z.number().optional(),
  })
  .optional()

const harEntrySchema = z.object({
  time: z.number().optional(),
  request: harRequestSchema,
  response: harResponseSchema,
  timings: harTimingsSchema,
})

export const harFileSchema = z.object({
  log: z.object({
    entries: z.array(harEntrySchema),
  }),
})
export type HarFile = z.infer<typeof harFileSchema>
export type HarEntry = HarFile['log']['entries'][number]

// A lighter-weight alternative to a full HAR export, for a single request/response pair
// pasted by hand rather than exported from devtools.
const simpleEntrySchema = z.object({
  method: z.string(),
  url: z.string(),
  status: z.number(),
  requestHeaders: z.record(z.string(), z.string()).default({}),
  responseHeaders: z.record(z.string(), z.string()).default({}),
  timeMs: z.number().optional(),
})

export const simplePairFileSchema = z.object({
  entries: z.array(simpleEntrySchema).min(1),
})
export type SimplePairFile = z.infer<typeof simplePairFileSchema>
export type SimplePairEntry = SimplePairFile['entries'][number]
