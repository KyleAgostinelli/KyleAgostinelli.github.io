import { Download, Mail } from 'lucide-react'
import Link from 'next/link'
import { supportCase } from '@/content/cases'
import { profile } from '@/content/profile'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14">
      <section>
        <h1 className="text-4xl font-semibold sm:text-5xl">{profile.name}</h1>
        <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
          {profile.title}. Looking for {profile.targetRole} roles.
        </p>
        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-800 dark:text-neutral-200">
          I reproduce the issue, isolate the cause, and communicate a fix. When engineering needs to
          get involved, I package the evidence they need rather than a description of the symptom.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.skillTags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-neutral-300 px-3 py-1 text-xs uppercase tracking-wide text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={profile.resumeHref}
            download
            className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-neutral-50 dark:text-neutral-900"
          >
            <Download size={16} aria-hidden="true" />
            Download resume
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
          >
            <Mail size={16} aria-hidden="true" />
            Get in touch
          </Link>
        </div>
      </section>

      <section aria-labelledby="proof-points-heading">
        <h2
          id="proof-points-heading"
          className="text-sm font-semibold uppercase tracking-wide text-neutral-500"
        >
          Proof points
        </h2>
        <dl className="mt-4 grid gap-6 sm:grid-cols-2">
          {profile.metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-xl font-semibold">{metric.label}</dt>
              <dd className="text-sm text-neutral-600 dark:text-neutral-400">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="case-study-heading">
        <h2
          id="case-study-heading"
          className="text-sm font-semibold uppercase tracking-wide text-neutral-500"
        >
          Case notes
        </h2>
        <h3 className="mt-4 text-2xl font-semibold">{supportCase.title}</h3>
        <p className="mt-2 max-w-2xl text-base leading-7 text-neutral-800 dark:text-neutral-200">
          {supportCase.summary}
        </p>
        <Link
          href="/work"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-50"
        >
          Read the full case
        </Link>
      </section>
    </div>
  )
}
