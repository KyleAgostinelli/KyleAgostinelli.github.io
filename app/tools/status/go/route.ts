import { NextResponse } from 'next/server'
import { z } from 'zod'

const querySchema = z.object({
  status: z.coerce.number().int().min(200).max(599),
})

// Exists so a plain <form method="GET"> can reach an arbitrary /api/http/:status without
// JavaScript - native forms can only append a query string, not interpolate a path segment,
// so this redirects a query-string request to the canonical path-based endpoint.
export function GET(request: Request): Response {
  const { searchParams, origin } = new URL(request.url)
  const parsed = querySchema.safeParse({ status: searchParams.get('status') })

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: 'invalid_status_code',
          message: 'Status must be an integer between 200 and 599.',
        },
      },
      { status: 400 },
    )
  }

  return NextResponse.redirect(new URL(`/api/http/${String(parsed.data.status)}`, origin))
}
