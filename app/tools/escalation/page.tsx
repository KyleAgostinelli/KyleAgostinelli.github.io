import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { EscalationForm } from '@/components/tools/EscalationForm'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata({
  title: 'Escalation Formatter',
  description:
    "Turn structured incident fields into a real escalation writeup, generated in Kyle Agostinelli's actual escalation format.",
  path: '/tools/escalation',
})

export default function EscalationToolPage() {
  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: 'Escalation Formatter', path: '/tools/escalation' },
        ]}
      />
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          Escalation formatter
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Takes structured incident fields and produces a properly formatted escalation writeup - my
          actual escalation format, made executable: document the ticket fully as if resolving it
          directly, then transfer to L2. The pre-transfer note is optional and only applies when
          something specific needs flagging before handoff.
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-sm text-ink-muted">
          Why a support engineer cares: an escalation that makes engineering ask five follow-up
          questions before they can start is a second round trip you didn&apos;t need. The format
          exists so the first handoff is the only one.
        </p>
      </div>

      <EscalationForm />
    </div>
  )
}
