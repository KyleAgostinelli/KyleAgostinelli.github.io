import type { Metadata } from 'next'
import { HarAnalyzer } from '@/components/tools/HarAnalyzer'

export const metadata: Metadata = {
  title: 'HAR Analyzer',
}

export default function HarToolPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          HAR analyzer
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Parses a HAR export or a simple request/response pair, server-side, and surfaces what
          actually matters in triage: failed requests, auth header problems, CORS preflight
          failures, redirect chains, slow requests, and mixed content.
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-sm text-ink-muted">
          Why a support engineer cares: a customer says &quot;the integration is broken&quot; and
          hands you a 3MB HAR file. Finding the one failed request in two hundred entries by eye is
          how tickets sit for an hour that should take five minutes.
        </p>
      </div>

      <HarAnalyzer />
    </div>
  )
}
