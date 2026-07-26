import { z } from 'zod'
import {
  buildMailtoHref,
  contactFormSchema,
  HONEYPOT_FIELD_NAME,
  MIN_SUBMIT_MS,
  RENDERED_AT_FIELD_NAME,
  type ContactActionState,
  type ContactFieldErrors,
  type ContactFormValues,
} from './schema'

const FORMSPREE_TIMEOUT_MS = 8000

function readField(formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

// A non-empty honeypot, or a missing/tampered/too-fast timestamp, marks the submission as
// automated. Real form-filling (reading the fields, typing an actual message) takes longer
// than MIN_SUBMIT_MS; a missing renderedAt only happens if something POSTs to this action
// directly instead of going through the rendered form at all.
function looksAutomated(formData: FormData): boolean {
  if (readField(formData, HONEYPOT_FIELD_NAME).length > 0) return true

  // Number('') is 0, not NaN - checked separately so a missing field reads as "invalid",
  // not as a (very old) timestamp that happens to clear the MIN_SUBMIT_MS bar.
  const renderedAtRaw = readField(formData, RENDERED_AT_FIELD_NAME)
  if (renderedAtRaw.length === 0) return true

  const renderedAt = Number(renderedAtRaw)
  if (!Number.isFinite(renderedAt)) return true

  return Date.now() - renderedAt < MIN_SUBMIT_MS
}

function readValues(formData: FormData): ContactFormValues {
  return {
    name: readField(formData, 'name'),
    email: readField(formData, 'email'),
    company: readField(formData, 'company'),
    opportunityType: readField(formData, 'opportunityType'),
    message: readField(formData, 'message'),
  }
}

// The testable core of the contact action. Kept separate from actions.ts (a 'use server'
// file, which Next.js only allows to export async functions) so it can be unit tested as a
// plain function, and so the Formspree endpoint is an explicit argument rather than a
// module-level constant - tests exercise the "no endpoint configured" and "endpoint
// configured" branches directly instead of fighting env var / module-caching timing.
export async function submitContactForm(
  formData: FormData,
  formspreeEndpoint: string | undefined,
): Promise<ContactActionState> {
  // Reports success without sending anything - telling a bot it failed just invites a retry
  // with a tweaked payload, and a real visitor never trips the honeypot or submits this fast.
  if (looksAutomated(formData)) {
    return { status: 'success' }
  }

  const values = readValues(formData)

  const parsed = contactFormSchema.safeParse({
    name: values.name,
    email: values.email,
    company: values.company.length > 0 ? values.company : undefined,
    opportunityType: values.opportunityType,
    message: values.message,
  })

  if (!parsed.success) {
    const tree = z.treeifyError(parsed.error)
    const fieldErrors: ContactFieldErrors = {}
    if (tree.properties?.name?.errors[0]) fieldErrors.name = tree.properties.name.errors[0]
    if (tree.properties?.email?.errors[0]) fieldErrors.email = tree.properties.email.errors[0]
    if (tree.properties?.company?.errors[0]) fieldErrors.company = tree.properties.company.errors[0]
    if (tree.properties?.opportunityType?.errors[0]) {
      fieldErrors.opportunityType = tree.properties.opportunityType.errors[0]
    }
    if (tree.properties?.message?.errors[0]) fieldErrors.message = tree.properties.message.errors[0]
    return { status: 'invalid', fieldErrors, values }
  }

  if (!formspreeEndpoint) {
    return { status: 'fallback', mailtoHref: buildMailtoHref(parsed.data) }
  }

  let response: Response
  try {
    response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(FORMSPREE_TIMEOUT_MS),
    })
  } catch {
    return {
      status: 'error',
      message: 'The email service did not respond. Email me directly instead.',
    }
  }

  if (!response.ok) {
    return {
      status: 'error',
      message: 'The email service rejected the message. Email me directly instead.',
    }
  }

  return { status: 'success' }
}
