import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata({
  title: 'Tools',
  description:
    'Real server-side diagnostic tools: an HTTP status explorer, a HAR analyzer, a client-only JWT decoder, an escalation formatter, and a DNS walkthrough.',
  path: '/tools',
})

const tools = [
  {
    href: '/tools/status',
    name: 'HTTP status explorer',
    description:
      'Fire a real request against any HTTP status code and inspect the actual response.',
  },
  {
    href: '/tools/har',
    name: 'HAR analyzer',
    description:
      'Paste a HAR export or a request/response pair and surface what matters in triage.',
  },
  {
    href: '/tools/jwt',
    name: 'JWT decoder',
    description: "Decode a token's header, claims, and expiry - entirely in your browser.",
  },
  {
    href: '/tools/escalation',
    name: 'Escalation formatter',
    description: 'Turn structured incident fields into a real escalation writeup.',
  },
  {
    href: '/tools/dns',
    name: 'DNS & connectivity walkthrough',
    description: 'Seven steps from browser to page, and how each one fails differently.',
  },
] as const

export default function ToolsIndexPage() {
  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
        ]}
      />
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">Tools</h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Real server-side route handlers, not a description of what they&apos;d do. Zod-validated
          input, real HTTP status codes, rate limiting, and progressive enhancement - each one works
          with JavaScript disabled where that&apos;s physically possible.
        </p>
      </div>

      <ul className="flex flex-col gap-6">
        {tools.map((tool) => (
          <li key={tool.href} className="border-t border-line pt-6">
            <Link href={tool.href} className="group">
              <h2 className="font-heading text-xl font-semibold text-ink group-hover:text-accent">
                {tool.name}
              </h2>
              <p className="mt-1 max-w-(--measure) text-pretty text-ink-muted">
                {tool.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
