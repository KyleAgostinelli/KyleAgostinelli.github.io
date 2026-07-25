'use client'

// Client boundary: the entire point of this tool is that the token never leaves the
// browser. There is no server-side equivalent to progressively enhance toward - decoding
// happens in JS or it doesn't happen at all. Unlike the other tools, there's no meaningful
// no-JS fallback here; that's stated explicitly in the UI rather than silently omitted.

import { useId, useMemo, useState } from 'react'
import { decodeJwt } from '@/lib/jwt/decode'

export function JwtDecoder() {
  const [token, setToken] = useState('')
  const textareaId = useId()

  const result = useMemo(() => (token.trim().length > 0 ? decodeJwt(token) : null), [token])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-md border border-line p-4">
        <p className="text-sm text-ink">
          This token never leaves your browser. Decoding happens entirely client-side in JavaScript
          - nothing is sent to a server, and this tool does not verify the signature (that needs the
          signing key, which isn&apos;t available here or anywhere in the browser).
        </p>
      </div>

      <label htmlFor={textareaId} className="text-sm text-ink">
        Paste a JWT
      </label>
      <textarea
        id={textareaId}
        value={token}
        onChange={(event) => {
          setToken(event.target.value)
        }}
        rows={4}
        className="rounded-md border border-line bg-canvas p-3 font-mono text-xs text-ink"
        placeholder="eyJhbGciOi..."
      />

      <div aria-live="polite" aria-atomic="true">
        {result && !result.success ? (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            {result.error}
          </p>
        ) : null}

        {result?.success ? (
          <div className="flex flex-col gap-4">
            {result.decoded.expiry.relativeDescription ? (
              <p
                className={`text-sm font-medium ${
                  result.decoded.expiry.isExpired ? 'text-red-700 dark:text-red-400' : 'text-ink'
                }`}
              >
                Token {result.decoded.expiry.relativeDescription}
              </p>
            ) : (
              <p className="text-sm text-ink-muted">
                No exp claim - this token doesn&apos;t expire on its own.
              </p>
            )}

            {result.decoded.scope ? (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Scope
                </h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {result.decoded.scope.map((scope) => (
                    <li
                      key={scope}
                      className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
                    >
                      {scope}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Header
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-md border border-line p-3 text-xs text-ink">
                {JSON.stringify(result.decoded.header, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Claims
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-md border border-line p-3 text-xs text-ink">
                {JSON.stringify(result.decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
