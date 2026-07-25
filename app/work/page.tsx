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
        <h1 className="text-3xl font-semibold">Project</h1>
        <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
          The clearest current example of how I work with unfamiliar code, typed systems, and real
          infrastructure.
        </p>

        <div className="mt-8 flex flex-col gap-10">
          {projects.map((project) => (
            <article
              key={project.name}
              className="border-t border-neutral-200 pt-6 dark:border-neutral-800"
            >
              <p className="text-xs uppercase tracking-wide text-neutral-500">{project.stage}</p>
              <h2 className="mt-1 text-xl font-semibold">{project.name}</h2>
              <p className="mt-2 max-w-2xl text-neutral-800 dark:text-neutral-200">
                {project.summary}
              </p>
              <p className="mt-2 max-w-2xl text-neutral-600 dark:text-neutral-400">
                {project.supportAngle}
              </p>
              <ul className="mt-4 list-inside list-disc text-sm text-neutral-700 dark:text-neutral-300">
                {project.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.signals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
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
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
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
        <h2 id="case-heading" className="text-3xl font-semibold">
          {supportCase.title}
        </h2>
        <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
          {supportCase.severity}
        </p>
        <p className="mt-4 max-w-2xl text-neutral-800 dark:text-neutral-200">
          {supportCase.summary}
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {caseColumns.map((column) => (
            <div key={column.label}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {column.label}
              </h3>
              <ul className="mt-3 list-inside list-disc text-sm text-neutral-700 dark:text-neutral-300">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Likely root cause
            </h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              {supportCase.likelyRootCause}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Customer summary
            </h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
              {supportCase.customerSummary}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
