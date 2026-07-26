import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BreadcrumbJsonLd, TechArticleJsonLd } from '@/components/JsonLd'
import { cases } from '@/content/cases'
import { buildPageMetadata } from '@/lib/metadata'

export function generateStaticParams(): { slug: string }[] {
  return cases.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supportCase = cases.find((c) => c.slug === slug)
  if (!supportCase) return { title: 'Case study' }
  return buildPageMetadata({
    title: supportCase.title,
    description: supportCase.summary,
    path: `/work/${supportCase.slug}`,
  })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supportCase = cases.find((c) => c.slug === slug)

  if (!supportCase) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-10">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/work' },
          { name: supportCase.title, path: `/work/${supportCase.slug}` },
        ]}
      />
      <TechArticleJsonLd
        headline={supportCase.title}
        description={supportCase.summary}
        path={`/work/${supportCase.slug}`}
      />
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">{supportCase.role}</p>
        <h1 className="mt-1 text-balance font-heading text-3xl font-semibold text-ink sm:text-4xl">
          {supportCase.title}
        </h1>
        <p className="mt-4 max-w-(--measure) text-pretty text-lg leading-7 text-ink">
          {supportCase.summary}
        </p>
      </div>

      <section aria-labelledby="context-heading">
        <h2
          id="context-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Context
        </h2>
        <p className="mt-3 max-w-(--measure) text-pretty text-ink">{supportCase.context}</p>
      </section>

      <section aria-labelledby="request-heading">
        <h2
          id="request-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          What he needed
        </h2>
        <ul className="mt-3 list-inside list-disc text-ink">
          {supportCase.request.map((item) => (
            <li key={item} className="max-w-(--measure) text-pretty">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="approach-heading">
        <h2
          id="approach-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          What I did
        </h2>
        <ul className="mt-3 list-inside list-disc text-ink">
          {supportCase.approach.map((item) => (
            <li key={item} className="max-w-(--measure) text-pretty">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="verification-heading">
        <h2
          id="verification-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Verification, before handoff
        </h2>
        <p className="mt-3 max-w-(--measure) text-pretty text-ink">{supportCase.verification}</p>
      </section>

      <section aria-labelledby="handoff-heading">
        <h2
          id="handoff-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Customer handoff
        </h2>
        <p className="mt-3 max-w-(--measure) text-pretty text-ink">{supportCase.handoff}</p>
        {/*
          NEEDS_KYLE: paste the real email you sent walking him through setup (redact any
          customer-identifying details). The rebuild brief specifically wants the actual
          customer-facing message here, not a paraphrase - logged in docs/NEEDS_KYLE.md.
        */}
      </section>

      <section aria-labelledby="outcome-heading">
        <h2
          id="outcome-heading"
          className="text-sm font-semibold uppercase tracking-wide text-ink-muted"
        >
          Outcome
        </h2>
        <p className="mt-3 max-w-(--measure) text-pretty text-ink">{supportCase.outcome}</p>
        {/*
          NEEDS_KYLE: is there anything you'd do differently in hindsight, or was this
          clean start to finish? A real "what I'd change" (or a real "no, this held up")
          is worth two sentences here - logged in docs/NEEDS_KYLE.md.
        */}
      </section>
    </div>
  )
}
