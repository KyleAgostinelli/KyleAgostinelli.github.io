import { NextResponse } from 'next/server'
import { z } from 'zod'
import { formatEscalation } from '@/lib/escalation/format'
import { escalationInputSchema } from '@/lib/escalation/schema'
import { checkRateLimit, getClientKey } from '@/lib/rate-limit'

const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000

function errorResponse(code: string, message: string, status: number, details?: unknown): Response {
  return NextResponse.json({ error: { code, message, details } }, { status })
}

function blankToUndefined(value: FormDataEntryValue | null): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined
}

// Supports a JS fetch() POST (application/json) and a plain <form method="POST">
// (application/x-www-form-urlencoded) - the latter is what makes this tool work with
// JavaScript disabled.
async function extractFields(request: Request): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      const body: unknown = await request.json()
      return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : null
    } catch {
      return null
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData()
    return {
      ticketSummary: blankToUndefined(formData.get('ticketSummary')),
      impact: blankToUndefined(formData.get('impact')),
      scope: blankToUndefined(formData.get('scope')),
      timestampWindowStart: blankToUndefined(formData.get('timestampWindowStart')),
      timestampWindowEnd: blankToUndefined(formData.get('timestampWindowEnd')),
      reproSteps: formData.getAll('reproSteps'),
      requestIds: formData.getAll('requestIds'),
      ruledOut: formData.getAll('ruledOut'),
      preTransferNote: blankToUndefined(formData.get('preTransferNote')),
      ask: blankToUndefined(formData.get('ask')),
    }
  }

  return null
}

export async function POST(request: Request): Promise<Response> {
  const rateLimit = checkRateLimit(
    `escalation:${getClientKey(request)}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: { code: 'rate_limited', message: 'Too many requests. Try again shortly.' } },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const fields = await extractFields(request)
  if (!fields) {
    return errorResponse('unsupported_content_type', 'Send JSON or form-encoded fields.', 415)
  }

  const parsed = escalationInputSchema.safeParse(fields)
  if (!parsed.success) {
    return errorResponse(
      'validation_failed',
      'One or more fields were invalid.',
      422,
      z.treeifyError(parsed.error),
    )
  }

  return NextResponse.json({ formatted: formatEscalation(parsed.data) }, { status: 200 })
}
