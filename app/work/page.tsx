import { ArrowRight, Code2 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supportCase } from '@/content/cases'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Work',
}

export default function WorkPage() {
  return (
    <div className="flex flex-col gap-14">
      <section>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          Project
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          The clearest current example of how I work with unfamiliar code, typed systems, and real
          infrastructure.
        </p>

        <div className="mt-8 flex flex-col gap-10">
          {projects.map((project) => (
            <article key={project.name} className="border-t border-line pt-6">
              <p className="text-xs uppercase tracking-wide text-ink-muted">{project.stage}</p>
              <h2 className="mt-1 font-heading text-xl font-semibold text-ink">{project.name}</h2>
              <p className="mt-2 max-w-(--measure) text-pretty text-ink">{project.summary}</p>
              <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
                {project.supportAngle}
              </p>
              <ul className="mt-4 list-inside list-disc text-sm text-ink-muted">
                {project.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.signals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
                  >
                    {signal}
                  </span>
                ))}
              </div>
              {project.repoUrl ? (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink underline underline-offset-4 hover:text-accent"
                >
                  <Code2 size={15} aria-hidden="true" />
                  View source
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

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
