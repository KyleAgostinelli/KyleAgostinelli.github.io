'use client'

// Client boundary: the tool's value is showing the *actual* response headers the browser
// received, which requires a real fetch() call from client JS - there is no server-rendered
// equivalent for that specific feature. But the form itself has a real action/method
// (submitting to /tools/status/go, which redirects to /api/http/:status), and the quick-link
// buttons are real <a> elements - both genuinely work with JS disabled, just without the
// header-table view. The onSubmit/onClick handlers below only intercept when JS actually runs.

import { useId, useState } from 'react'
import {
  diagnosticPayloadSchema,
  quickLinkCodes,
  type DiagnosticPayload,
} from '@/content/tools/http-status'

interface ExplorerResult {
  status: number
  statusText: string
  headers: [string, string][]
  diagnostic: DiagnosticPayload | null
  parseError: boolean
}

async function fireRequest(status: number): Promise<ExplorerResult> {
  const response = await fetch(`/api/http/${String(status)}`, { cache: 'no-store' })
  const headers: [string, string][] = [...response.headers.entries()]
  const diagnosticHeader = response.headers.get('x-diagnostic')

  let raw: unknown = null
  if (diagnosticHeader) {
    raw = JSON.parse(decodeURIComponent(diagnosticHeader))
  } else {
    const text = await response.text()
    raw = text.length > 0 ? JSON.parse(text) : null
  }

  const parsed = raw === null ? null : diagnosticPayloadSchema.safeParse(raw)

  return {
    status: response.status,
    statusText: response.statusText,
    headers,
    diagnostic: parsed?.success ? parsed.data : null,
    parseError: raw !== null && !parsed?.success,
  }
}

export function StatusExplorer() {
  const [status, setStatus] = useState('404')
  const [result, setResult] = useState<ExplorerResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const resultsHeadingId = useId()

  async function runRequest(rawStatus: string): Promise<void> {
    const parsedStatus = Number(rawStatus)

    if (!Number.isInteger(parsedStatus) || parsedStatus < 200 || parsedStatus > 599) {
      setError('Enter an integer between 200 and 599.')
      setResult(null)
      return
    }

    setError(null)
    setIsPending(true)
    try {
      setResult(await fireRequest(parsedStatus))
    } catch {
      setError('The request failed unexpectedly. Try again.')
      setResult(null)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        action="/tools/status/go"
        method="GET"
        onSubmit={(event) => {
          event.preventDefault()
          void runRequest(status)
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="flex flex-col gap-1 text-sm text-ink">
          Status code
          <input
            name="status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value)
            }}
            inputMode="numeric"
            aria-describedby={error ? 'status-input-error' : undefined}
            className="w-32 rounded-md border border-line bg-canvas px-3 py-2 text-ink"
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-accent px-4 py-2 text-sm text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? 'Firing…' : 'Fire request'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {quickLinkCodes.map((code) => (
          <a
            key={code}
            href={`/api/http/${String(code)}`}
            onClick={(event) => {
              event.preventDefault()
              setStatus(String(code))
              void runRequest(String(code))
            }}
            className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            {code}
          </a>
        ))}
      </div>

      <div aria-live="polite" aria-atomic="true">
        {error ? (
          <p
            id="status-input-error"
            role="alert"
            className="text-sm text-red-700 dark:text-red-400"
          >
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="flex flex-col gap-4 rounded-md border border-line p-4">
            <p className="font-mono text-sm text-ink">
              {result.status} {result.statusText}
            </p>

            <div>
              <h3
                id={resultsHeadingId}
                className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
              >
                Response headers
              </h3>
              <ul className="mt-2 flex flex-col gap-1 font-mono text-xs text-ink-muted">
                {result.headers.map(([name, value]) => (
                  <li key={name}>
                    {name}: {value}
                  </li>
                ))}
              </ul>
            </div>

            {result.diagnostic ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-ink">{result.diagnostic.meaning}</p>
                {result.diagnostic.commonCauses.length > 0 ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      Common causes
                    </h3>
                    <ul className="mt-2 list-inside list-disc text-sm text-ink-muted">
                      {result.diagnostic.commonCauses.map((cause) => (
                        <li key={cause}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {result.diagnostic.whatToCheckFirst.length > 0 ? (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                      What to check first
                    </h3>
                    <ul className="mt-2 list-inside list-disc text-sm text-ink-muted">
                      {result.diagnostic.whatToCheckFirst.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {result.parseError ? (
              <p role="alert" className="text-sm text-red-700 dark:text-red-400">
                The response didn&apos;t match the expected shape - showing the raw headers above
                only.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
