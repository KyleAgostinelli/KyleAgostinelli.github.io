import { Code2 } from 'lucide-react'
import type { Metadata } from 'next'
import { supportCase } from '@/content/cases'
import { projects } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Work',
}

const caseColumns = [
  { label: 'Symptoms', items: supportCase.symptoms },
  { label: 'Evidence', items: supportCase.evidence },
  { label: 'Troubleshooting steps', items: supportCase.troubleshootingSteps },
] as const

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
        <h2 id="case-heading" className="text-balance font-heading text-3xl font-semibold text-ink">
          {supportCase.title}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
          {supportCase.severity}
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-ink">{supportCase.summary}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {caseColumns.map((column) => (
            <div key={column.label}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                {column.label}
              </h3>
              <ul className="mt-3 list-inside list-disc text-sm text-ink-muted">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Likely root cause
            </h3>
            <p className="mt-2 text-sm text-ink-muted">{supportCase.likelyRootCause}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Customer summary
            </h3>
            <p className="mt-2 text-sm text-ink-muted">{supportCase.customerSummary}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
