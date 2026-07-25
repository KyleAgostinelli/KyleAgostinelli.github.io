import { NextResponse } from 'next/server'
import { analyzeHar } from '@/lib/har/parse'
import { checkRateLimit, getClientKey } from '@/lib/rate-limit'

// Comfortably under Vercel's default serverless request-body ceiling (~4.5MB), so a payload
// this tool rejects fails with a clear, specific error instead of a generic platform 413.
const MAX_HAR_BYTES = 3 * 1024 * 1024
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60_000

function errorResponse(code: string, message: string, status: number): Response {
  return NextResponse.json({ error: { code, message } }, { status })
}

// Supports both a JS fetch() POST (Content-Type: application/json, body IS the HAR text)
// and a plain <form method="POST"> submission (application/x-www-form-urlencoded, HAR text
// in a "har" field) - the second is what makes the tool work with JavaScript disabled.
async function extractHarText(request: Request): Promise<string | null> {
  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return request.text()
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData()
    const value = formData.get('har')
    return typeof value === 'string' ? value : null
  }

  return null
}

export async function POST(request: Request): Promise<Response> {
  const rateLimit = checkRateLimit(
    `har:${getClientKey(request)}`,
    RATE_LIMIT_MAX,
    RATE_LIMIT_WINDOW_MS,
  )
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: { code: 'rate_limited', message: 'Too many requests. Try again shortly.' } },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
    )
  }

  const harText = await extractHarText(request)
  if (harText === null) {
    return errorResponse('unsupported_content_type', 'Send JSON or a form field named "har".', 415)
  }

  if (harText.length > MAX_HAR_BYTES) {
    return errorResponse(
      'payload_too_large',
      `HAR payload exceeds the ${String(MAX_HAR_BYTES / (1024 * 1024))}MB limit for this tool. Trim response bodies before pasting.`,
      413,
    )
  }

  let parsedBody: unknown
  try {
    parsedBody = JSON.parse(harText)
  } catch {
    return errorResponse('invalid_json', 'That content is not valid JSON.', 400)
  }

  const result = analyzeHar(parsedBody)
  if (!result.success) {
    return errorResponse('unrecognized_format', result.error, 422)
  }

  return NextResponse.json({ summary: result.summary }, { status: 200 })
}
