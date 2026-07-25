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
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          Contact
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Use the form for TSE, Support Specialist II, API Support, IT Support, or adjacent
          technical opportunities.
        </p>
      </div>

      <ContactForm />

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Direct contact
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="mt-2 inline-flex items-center gap-2 text-sm text-ink hover:text-accent"
        >
          <Mail size={15} aria-hidden="true" />
          {profile.email}
        </a>
        <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
          <MapPin size={15} aria-hidden="true" />
          {profile.location}
        </div>
      </div>
    </div>
  )
}
