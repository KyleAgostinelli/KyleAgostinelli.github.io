import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  categoryForCode,
  getHttpStatusEntry,
  type DiagnosticPayload,
} from '@/content/tools/http-status'

const paramsSchema = z.object({
  status: z.coerce.number().int().min(200).max(599),
})

function buildPayload(status: number): DiagnosticPayload {
  const entry = getHttpStatusEntry(status)
  if (entry) {
    return {
      status,
      reasonPhrase: entry.reasonPhrase,
      category: entry.category,
      meaning: entry.meaning,
      commonCauses: entry.commonCauses,
      whatToCheckFirst: entry.whatToCheckFirst,
    }
  }
  return {
    status,
    reasonPhrase: null,
    category: categoryForCode(status),
    meaning:
      "This code isn't in the curated reference set below, but the response status is real - it reflects the actual HTTP status this endpoint returned for the number you asked for.",
    commonCauses: [],
    whatToCheckFirst: [],
  }
}

// Per RFC 9110 section 6.4.1, these statuses must never carry a response body. The Fetch
// Response constructor enforces this at the platform level (throws if you try), so the
// explanation for these three travels via a response header instead - which the UI reads
// directly. That's the tool proving its own point: sometimes the answer really is in the
// headers, not the body.
const NULL_BODY_STATUSES = new Set([204, 205, 304])

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ status: string }> },
): Promise<Response> {
  const resolved = await params
  const parsed = paramsSchema.safeParse(resolved)

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'invalid_status_code',
          message:
            'Status code must be an integer between 200 and 599. 1xx codes are interim responses and cannot be demonstrated as a standalone HTTP response via this endpoint.',
        },
      },
      { status: 400 },
    )
  }

  const { status } = parsed.data
  const payload = buildPayload(status)

  if (NULL_BODY_STATUSES.has(status)) {
    return new Response(null, {
      status,
      headers: {
        'X-Diagnostic': encodeURIComponent(JSON.stringify(payload)),
      },
    })
  }

  return NextResponse.json(payload, { status })
}
