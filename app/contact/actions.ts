'use server'

import { env } from '@/lib/env'
import type { ContactActionState } from './schema'
import { submitContactForm } from './submit-contact-form'

export async function submitContact(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  return submitContactForm(formData, env.FORMSPREE_ENDPOINT)
}
