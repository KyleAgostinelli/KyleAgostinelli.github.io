import { Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { profile } from '@/content/profile'
import { submitContact } from './actions'
import { opportunityTypes } from './schema'

export const metadata: Metadata = {
  title: 'Contact',
}

const inputClassName =
  'rounded-md border border-neutral-300 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900'

function StatusBanner({
  status,
  mailto,
}: {
  status: string | undefined
  mailto: string | undefined
}) {
  if (status === 'success') {
    return (
      <p
        role="status"
        className="rounded-md border border-neutral-300 px-4 py-3 text-sm dark:border-neutral-700"
      >
        Message sent. Thanks for reaching out.
      </p>
    )
  }

  if (status === 'invalid') {
    return (
      <p
        role="alert"
        className="rounded-md border border-neutral-300 px-4 py-3 text-sm dark:border-neutral-700"
      >
        Please check the fields below and try again.
      </p>
    )
  }

  if (status === 'fallback' && mailto) {
    return (
      <p
        role="status"
        className="rounded-md border border-neutral-300 px-4 py-3 text-sm dark:border-neutral-700"
      >
        No email service is configured yet.{' '}
        <a href={mailto} className="underline underline-offset-4">
          Click here to send a prefilled email instead.
        </a>
      </p>
    )
  }

  if (status === 'error') {
    return (
      <p
        role="alert"
        className="rounded-md border border-neutral-300 px-4 py-3 text-sm dark:border-neutral-700"
      >
        The email service did not respond. Email me directly at {profile.email}.
      </p>
    )
  }

  return null
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; mailto?: string }>
}) {
  const { status, mailto } = await searchParams

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Use the form for TSE, Support Specialist II, API Support, IT Support, or adjacent
          technical opportunities.
        </p>
      </div>

      <StatusBanner status={status} mailto={mailto} />

      <form action={submitContact} className="grid max-w-xl gap-5">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input name="name" required autoComplete="name" className={inputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={inputClassName}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Company
          <input name="company" autoComplete="organization" className={inputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Opportunity type
          <select
            name="opportunityType"
            defaultValue={opportunityTypes[0]}
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
          <textarea name="message" required minLength={12} rows={5} className={inputClassName} />
        </label>
        <button
          type="submit"
          className="inline-flex w-fit items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-neutral-50 dark:text-neutral-900"
        >
          <Mail size={16} aria-hidden="true" />
          Send message
        </button>
      </form>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Direct contact
        </h2>
        <a href={`mailto:${profile.email}`} className="mt-2 inline-flex items-center gap-2 text-sm">
          <Mail size={15} aria-hidden="true" />
          {profile.email}
        </a>
        <div className="mt-1 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <MapPin size={15} aria-hidden="true" />
          {profile.location}
        </div>
      </div>
    </div>
  )
}
