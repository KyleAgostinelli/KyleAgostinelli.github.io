import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supportCase } from '@/content/cases'

export const metadata: Metadata = {
  title: 'Work',
}

export default function WorkPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">Work</h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          A real incident, written up the way I&apos;d want to hand it to someone else.
        </p>
      </div>

      <section aria-labelledby="case-heading">
        <h2
          id="case-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Case notes
        </h2>
        <h3 className="mt-3 text-balance font-heading text-2xl font-semibold text-ink">
          {supportCase.title}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">{supportCase.role}</p>
        <p className="mt-4 max-w-(--measure) text-pretty text-ink">{supportCase.summary}</p>
        <Link
          href={`/work/${supportCase.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-accent"
        >
          Read the full case
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
