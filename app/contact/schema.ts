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
  name: z.string().trim().min(1, 'Enter your name.'),
  email: z.string().trim().pipe(z.email('Enter a valid email address.')),
  company: z.string().trim().optional(),
  opportunityType: z.enum(opportunityTypes, { message: 'Choose an opportunity type.' }),
  message: z.string().trim().min(12, 'Say a little more about the opportunity (12+ characters).'),
})
export type ContactFormOutput = z.infer<typeof contactFormSchema>

// Raw, untrimmed values as submitted - used to echo the user's input back into the form
// after a validation failure so nothing they typed is lost.
export interface ContactFormValues {
  name: string
  email: string
  company: string
  opportunityType: string
  message: string
}

export const emptyContactValues: ContactFormValues = {
  name: '',
  email: '',
  company: '',
  opportunityType: opportunityTypes[0],
  message: '',
}

export type ContactFieldErrors = Partial<Record<keyof ContactFormOutput, string>>

export type ContactActionState =
  | { status: 'idle' }
  | { status: 'invalid'; fieldErrors: ContactFieldErrors; values: ContactFormValues }
  | { status: 'success' }
  | { status: 'fallback'; mailtoHref: string }
  | { status: 'error'; message: string }

export const initialContactState: ContactActionState = { status: 'idle' }

// Requires the mailto: protocol specifically. A mailto href is only ever safe to render
// when it was built by buildMailtoHref below (recipient is always the hardcoded
// profile.email) - this schema is the last line of defense against ever rendering an
// attacker-influenced href on this domain.
export const mailtoHrefSchema = z.string().refine((value) => {
  try {
    return new URL(value).protocol === 'mailto:'
  } catch {
    return false
  }
}, 'Must be a mailto: URI')

export function buildMailtoHref(form: ContactFormOutput): string {
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
