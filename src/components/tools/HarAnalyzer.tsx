'use client'

// Client boundary: parsing runs server-side (src/lib/har/parse.ts, called from
// app/api/har/analyze/route.ts) - this component only formats and displays the JSON result.
// The form has a real action/method, so submitting with JS disabled still POSTs to the real
// route handler and shows its raw JSON response; this onSubmit only intercepts to render it
// nicely when JS is available.

import { useId, useState } from 'react'
import type { HarFinding, HarSummary } from '@/lib/har/types'

type AnalyzeResult =
  { status: 'success'; summary: HarSummary } | { status: 'error'; message: string }

async function analyze(harText: string): Promise<AnalyzeResult> {
  const response = await fetch('/api/har/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: harText,
  })

  const body = (await response.json()) as { summary?: HarSummary; error?: { message: string } }

  if (!response.ok) {
    return { status: 'error', message: body.error?.message ?? 'The request failed.' }
  }

  if (!body.summary) {
    return { status: 'error', message: 'The response was missing a summary.' }
  }

  return { status: 'success', summary: body.summary }
}

const severityClassName: Record<HarFinding['severity'], string> = {
  error: 'text-red-700 dark:text-red-400',
  warning: 'text-ink',
  info: 'text-ink-muted',
}

export function HarAnalyzer() {
  const [harText, setHarText] = useState('')
  const [result, setResult] = useState<AnalyzeResult | null>(null)
  const [isPending, setIsPending] = useState(false)
  const textareaId = useId()

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (harText.trim().length === 0) return

    setIsPending(true)
    try {
      setResult(await analyze(harText))
    } catch {
      setResult({ status: 'error', message: 'The request failed unexpectedly. Try again.' })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        action="/api/har/analyze"
        method="POST"
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor={textareaId} className="text-sm text-ink">
          Paste a HAR export (browser devtools → Network → Save all as HAR), or a simple{' '}
          <code className="rounded-sm bg-line px-1 py-0.5 text-xs">{'{ "entries": [...] }'}</code>{' '}
          request/response pair.
        </label>
        <textarea
          id={textareaId}
          name="har"
          value={harText}
          onChange={(event) => {
            setHarText(event.target.value)
          }}
          rows={10}
          className="rounded-md border border-line bg-canvas p-3 font-mono text-xs text-ink"
          placeholder='{"log": {"entries": [...]}}'
        />
        <p className="text-xs text-ink-muted">
          Authorization, Cookie, and Set-Cookie header values are stripped before analysis and never
          logged - only whether they were present, absent, or malformed is reported.
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="w-fit rounded-md bg-accent px-4 py-2 text-sm text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? 'Analyzing…' : 'Analyze'}
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {result?.status === 'error' ? (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            {result.message}
          </p>
        ) : null}

        {result?.status === 'success' ? (
          <div className="flex flex-col gap-3 rounded-md border border-line p-4">
            <p className="text-sm text-ink-muted">
              {result.summary.totalRequests} request{result.summary.totalRequests === 1 ? '' : 's'}{' '}
              analyzed, {result.summary.findings.length} finding
              {result.summary.findings.length === 1 ? '' : 's'}.
            </p>
            {result.summary.findings.length === 0 ? (
              <p className="text-sm text-ink">
                Nothing stood out - no failures, redirects, or slow requests detected.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {result.summary.findings.map((finding) => (
                  <li
                    key={`${finding.type}|${finding.method}|${finding.url}|${String(finding.status)}|${finding.message}`}
                    className={`text-sm ${severityClassName[finding.severity]}`}
                  >
                    <span className="font-mono text-xs uppercase tracking-wide">
                      {finding.type}
                    </span>{' '}
                    — {finding.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
