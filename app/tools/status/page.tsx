import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { StatusExplorer } from '@/components/tools/StatusExplorer'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata({
  title: 'HTTP Status Explorer',
  description:
    'Fire a real request against any HTTP status code and inspect the actual response headers, with an explanation of what each status means and what to check first.',
  path: '/tools/status',
})

export default function StatusToolPage() {
  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: 'HTTP Status Explorer', path: '/tools/status' },
        ]}
      />
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          HTTP status explorer
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Fires a real request against a route handler that returns the actual HTTP status you ask
          for, then explains what it means and what to check first.
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-sm text-ink-muted">
          Why a support engineer cares: half of API troubleshooting is knowing what a status code
          actually promises versus what people assume it means - 401 vs. 403, why a 204 has no body,
          why a 429 needs a backoff and not a retry loop.
        </p>
      </div>

      <StatusExplorer />
    </div>
  )
}
