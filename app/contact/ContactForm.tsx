'use client'

// Client boundary: useActionState tracks pending/result state so repeat submissions update
// in place once JS is available. The form still degrades to a plain POST without JS -
// Next.js server-renders this component using the action's returned state for that same
// request, so validation errors and echoed field values show up in the response HTML
// either way, no client-side state required for the first round trip.

import { Mail } from 'lucide-react'
import { useActionState } from 'react'
import { profile } from '@/content/profile'
import { submitContact } from './actions'
import {
  emptyContactValues,
  initialContactState,
  mailtoHrefSchema,
  opportunityTypes,
  type ContactFieldErrors,
  type ContactFormValues,
} from './schema'

const inputClassName =
  'rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900'
const bannerClassName =
  'rounded-md border border-neutral-300 px-4 py-3 text-sm dark:border-neutral-700'

function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null
  return (
    <span id={id} role="alert" className="text-sm text-red-700 dark:text-red-400">
      {message}
    </span>
  )
}

function FallbackBanner({ mailtoHref }: { mailtoHref: string }) {
  // mailtoHref always comes from buildMailtoHref (server-computed, never client input), but
  // this validation stays regardless: nothing gets rendered as an href on this domain
  // without first proving it really is a mailto: URI.
  const parsed = mailtoHrefSchema.safeParse(mailtoHref)

  return (
    <p role="status" className={bannerClassName}>
      No email service is configured yet.{' '}
      {parsed.success ? (
        <a href={parsed.data} className="underline underline-offset-4">
          Click here to send a prefilled email instead.
        </a>
      ) : (
        <>Email me directly at {profile.email}.</>
      )}
    </p>
  )
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialContactState)

  if (state.status === 'success') {
    return (
      <p role="status" className={bannerClassName}>
        Message sent. Thanks for reaching out.
      </p>
    )
  }

  const values: ContactFormValues = state.status === 'invalid' ? state.values : emptyContactValues
  const fieldErrors: ContactFieldErrors = state.status === 'invalid' ? state.fieldErrors : {}

  return (
    <div className="flex flex-col gap-5">
      {state.status === 'fallback' ? <FallbackBanner mailtoHref={state.mailtoHref} /> : null}
      {state.status === 'error' ? (
        <p role="alert" className={bannerClassName}>
          {state.message}
        </p>
      ) : null}
      {state.status === 'invalid' ? (
        <p role="alert" className={bannerClassName}>
          Please check the fields below.
        </p>
      ) : null}

      <form action={formAction} className="grid max-w-xl gap-5" noValidate>
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="name"
            required
            autoComplete="name"
            defaultValue={values.name}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            className={inputClassName}
          />
          <FieldError id="name-error" message={fieldErrors.name} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={values.email}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className={inputClassName}
          />
          <FieldError id="email-error" message={fieldErrors.email} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Company
          <input
            name="company"
            autoComplete="organization"
            defaultValue={values.company}
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Opportunity type
          <select
            name="opportunityType"
            defaultValue={values.opportunityType}
            className={inputClassName}
          >
            {opportunityTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Message
          <textarea
            name="message"
            required
            minLength={12}
            rows={5}
            defaultValue={values.message}
            aria-invalid={fieldErrors.message ? true : undefined}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            className={inputClassName}
          />
          <FieldError id="message-error" message={fieldErrors.message} />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-neutral-50 dark:text-neutral-900"
        >
          <Mail size={16} aria-hidden="true" />
          {isPending ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  )
}
