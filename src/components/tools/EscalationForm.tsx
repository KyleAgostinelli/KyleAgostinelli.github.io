'use client'

// Client boundary: only the result display and clipboard copy are client-side. The form
// itself has a real action/method - submitting with JS disabled still POSTs to the real
// route handler and shows its raw JSON response; this onSubmit only intercepts to render
// the formatted text nicely (and offer a copy button) when JS is available.

import { useState } from 'react'

const inputClassName = 'rounded-md border border-line bg-canvas px-3 py-2 text-sm text-ink'
const textareaClassName = `${inputClassName} min-h-24`

function linesFrom(formData: FormData, name: string): string[] {
  const raw = formData.get(name)
  if (typeof raw !== 'string') return []
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function blankToUndefined(value: FormDataEntryValue | null): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

async function submitEscalation(
  formData: FormData,
): Promise<{ status: 'ok'; formatted: string } | { status: 'error'; message: string }> {
  const payload = {
    ticketSummary: formData.get('ticketSummary'),
    impact: formData.get('impact'),
    scope: formData.get('scope'),
    timestampWindowStart: formData.get('timestampWindowStart'),
    timestampWindowEnd: formData.get('timestampWindowEnd'),
    reproSteps: linesFrom(formData, 'reproSteps'),
    requestIds: linesFrom(formData, 'requestIds'),
    ruledOut: linesFrom(formData, 'ruledOut'),
    preTransferNote: blankToUndefined(formData.get('preTransferNote')),
    ask: formData.get('ask'),
  }

  const response = await fetch('/api/escalation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const body = (await response.json()) as { formatted?: string; error?: { message: string } }

  if (!response.ok) {
    return { status: 'error', message: body.error?.message ?? 'The request failed.' }
  }
  if (!body.formatted) {
    return { status: 'error', message: 'The response was missing the formatted writeup.' }
  }
  return { status: 'ok', formatted: body.formatted }
}

export function EscalationForm() {
  const [result, setResult] = useState<
    { status: 'ok'; formatted: string } | { status: 'error'; message: string } | null
  >(null)
  const [isPending, setIsPending] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setIsPending(true)
    setCopied(false)
    try {
      setResult(await submitEscalation(formData))
    } catch {
      setResult({ status: 'error', message: 'The request failed unexpectedly. Try again.' })
    } finally {
      setIsPending(false)
    }
  }

  async function copyResult(): Promise<void> {
    if (result?.status !== 'ok') return
    await navigator.clipboard.writeText(result.formatted)
    setCopied(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        action="/api/escalation"
        method="POST"
        onSubmit={(event) => {
          void handleSubmit(event)
        }}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1 text-sm text-ink">
          Ticket summary
          <input name="ticketSummary" required className={inputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Impact
          <textarea name="impact" required className={textareaClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Scope
          <textarea name="scope" required className={textareaClassName} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Timestamp window start
            <input name="timestampWindowStart" required className={inputClassName} />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Timestamp window end
            <input name="timestampWindowEnd" required className={inputClassName} />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Reproduction steps (one per line)
          <textarea name="reproSteps" required className={textareaClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Request IDs (one per line, optional)
          <textarea name="requestIds" className={textareaClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Ruled out (one per line, optional)
          <textarea name="ruledOut" className={textareaClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          Pre-transfer note (only if something needs flagging to L2 before handoff)
          <textarea name="preTransferNote" className={textareaClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink">
          The ask
          <textarea name="ask" required className={textareaClassName} />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="w-fit rounded-md bg-accent px-4 py-2 text-sm text-accent-contrast transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? 'Formatting…' : 'Generate escalation'}
        </button>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {result?.status === 'error' ? (
          <p role="alert" className="text-sm text-red-700 dark:text-red-400">
            {result.message}
          </p>
        ) : null}

        {result?.status === 'ok' ? (
          <div className="flex flex-col gap-3 rounded-md border border-line p-4">
            <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-ink">
              {result.formatted}
            </pre>
            <button
              type="button"
              onClick={() => {
                void copyResult()
              }}
              className="w-fit rounded-md border border-line px-3 py-1.5 text-xs text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {copied ? 'Copied' : 'Copy to clipboard'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
