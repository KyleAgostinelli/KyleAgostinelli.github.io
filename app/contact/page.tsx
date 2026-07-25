import { Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { profile } from '@/content/profile'
import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Use the form for TSE, Support Specialist II, API Support, IT Support, or adjacent
          technical opportunities.
        </p>
      </div>

      <ContactForm />

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
