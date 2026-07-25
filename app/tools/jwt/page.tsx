import type { Metadata } from 'next'
import { JwtDecoder } from '@/components/tools/JwtDecoder'

export const metadata: Metadata = {
  title: 'JWT Decoder',
}

export default function JwtToolPage() {
  return (
    <div className="flex flex-col gap-8">
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
