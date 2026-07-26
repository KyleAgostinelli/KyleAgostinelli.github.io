import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { JwtDecoder } from '@/components/tools/JwtDecoder'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata({
  title: 'JWT Decoder',
  description:
    "Decode a JWT's header, claims, and expiry entirely in your browser - the token never leaves the client.",
  path: '/tools/jwt',
})

export default function JwtToolPage() {
  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: 'JWT Decoder', path: '/tools/jwt' },
        ]}
      />
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">
          JWT decoder
        </h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Decodes a JWT&apos;s header and claims, and does the expiry math, entirely in your
          browser.
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-sm text-ink-muted">
          Why a support engineer cares: a huge share of &quot;the API stopped working after nothing
          changed&quot; tickets are just an expired token, or one issued without the scope the
          endpoint needs. Reading the claims directly settles it in seconds instead of guessing from
          the outside.
        </p>
      </div>

      <JwtDecoder />
    </div>
  )
}
