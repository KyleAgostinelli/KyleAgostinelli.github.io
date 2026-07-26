import { Download, Mail } from 'lucide-react'
import Link from 'next/link'
import { PersonJsonLd } from '@/components/JsonLd'
import { supportCase } from '@/content/cases'
import { profile } from '@/content/profile'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14">
      <PersonJsonLd />
      <section>
        <h1 className="reveal text-balance font-heading text-4xl font-semibold text-ink sm:text-5xl">
          {profile.name}
        </h1>
        <p className="mt-2 text-lg text-ink-muted">
          {profile.title}. Looking for {profile.targetRole} roles.
        </p>
        <p className="mt-6 max-w-(--measure) text-pretty text-base leading-7 text-ink">
          I reproduce the issue, isolate the cause, and communicate a fix. When engineering needs to
          get involved, I package the evidence they need rather than a description of the symptom.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.skillTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wide text-ink-muted"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={profile.resumeHref}
            download
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm text-accent-contrast transition-colors hover:bg-accent-hover"
          >
            <Download size={16} aria-hidden="true" />
            Download resume
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
          >
            <Mail size={16} aria-hidden="true" />
            Get in touch
          </Link>
        </div>
      </section>

      <section aria-labelledby="proof-points-heading">
        <h2
          id="proof-points-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Proof points
        </h2>
        <dl className="mt-4 grid gap-6 sm:grid-cols-2">
          {profile.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-xl font-semibold text-ink">{metric.label}</dt>
              <dd className="text-sm text-ink-muted">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="case-study-heading">
        <h2
          id="case-study-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Case notes
        </h2>
        <h3 className="mt-4 text-balance font-heading text-2xl font-semibold text-ink">
          {supportCase.title}
        </h3>
        <p className="mt-2 max-w-(--measure) text-pretty text-base leading-7 text-ink">
          {supportCase.summary}
        </p>
        <Link
          href={`/work/${supportCase.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-accent"
        >
          Read the full case
        </Link>
      </section>
    </div>
  )
}
