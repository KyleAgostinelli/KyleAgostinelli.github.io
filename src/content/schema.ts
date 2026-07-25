import { z } from 'zod'

export const nonEmptyString = z.string().min(1)
export const urlString = z.url()

export const metricSchema = z.object({
  label: nonEmptyString,
  value: nonEmptyString,
  tone: z.enum(['success', 'info', 'warning', 'accent']),
})
export type Metric = z.infer<typeof metricSchema>
