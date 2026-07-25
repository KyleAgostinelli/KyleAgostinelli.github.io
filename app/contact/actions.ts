'use server'

import { redirect } from 'next/navigation'
import { env } from '@/lib/env'
import { buildMailtoHref, contactFormSchema } from './schema'

function blankToUndefined(value: FormDataEntryValue | null): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

export async function submitContact(formData: FormData): Promise<void> {
  const parsed = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    company: blankToUndefined(formData.get('company')),
    opportunityType: formData.get('opportunityType'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    redirect('/contact?status=invalid')
  }

  if (!env.FORMSPREE_ENDPOINT) {
    redirect(`/contact?status=fallback&mailto=${encodeURIComponent(buildMailtoHref(parsed.data))}`)
  }

  const response = await fetch(env.FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parsed.data),
  })

  if (!response.ok) {
    redirect('/contact?status=error')
  }

  redirect('/contact?status=success')
}
