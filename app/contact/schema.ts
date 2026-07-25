import { z } from 'zod'
import { profile } from '@/content/profile'

export const opportunityTypes = [
  'TSE / Support Engineer',
  'Support Specialist II',
  'API Support',
  'IT Support',
  'Other technical opportunity',
] as const

export const contactFormSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().pipe(z.email()),
  company: z.string().trim().optional(),
  opportunityType: z.enum(opportunityTypes),
  message: z.string().trim().min(12),
})
export type ContactForm = z.infer<typeof contactFormSchema>

export function buildMailtoHref(form: ContactForm): string {
  const subject = encodeURIComponent(`Portfolio opportunity from ${form.company ?? form.name}`)
  const body = encodeURIComponent(
    [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company ?? 'Not provided'}`,
      `Opportunity: ${form.opportunityType}`,
      '',
      form.message,
    ].join('\n'),
  )
  return `mailto:${profile.email}?subject=${subject}&body=${body}`
}
