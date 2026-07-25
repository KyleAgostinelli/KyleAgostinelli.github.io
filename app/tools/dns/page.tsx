import type { Metadata } from 'next'
import { dnsSteps } from '@/content/tools/dns-steps'

export const metadata: Metadata = {
  title: 'DNS & Connectivity Explainer',
}

export default function DnsToolPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          DNS &amp; connectivity walkthrough
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          A request from browser to page touches seven distinct steps before anything
          application-specific happens. Each one fails differently, and looks different to the
          customer - the failure mode is usually enough to tell you which layer to check first.
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-sm text-ink-muted">
          Why a support engineer cares: &quot;the site is down&quot; could mean any of these seven
          things, and they have almost nothing in common to fix. Knowing which one you&apos;re
          looking at before you start troubleshooting saves the whole call.
        </p>
      </div>

      <ol className="flex flex-col gap-3">
        {dnsSteps.map((step, index) => (
          <li key={step.id}>
            <details className="rounded-md border border-line p-4">
              <summary className="cursor-pointer font-heading text-lg font-semibold text-ink">
                {index + 1}. {step.name}
              </summary>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    What happens
                  </h3>
                  <p className="mt-1 max-w-(--measure) text-pretty text-ink">{step.whatHappens}</p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Common failure
                  </h3>
                  <p className="mt-1 max-w-(--measure) text-pretty text-ink">
                    {step.commonFailure}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    What the customer sees
                  </h3>
                  <p className="mt-1 max-w-(--measure) text-pretty text-ink">
                    {step.customerSymptom}
                  </p>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  )
}
