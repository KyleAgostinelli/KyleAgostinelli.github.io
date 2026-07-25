import { describe, expect, it } from 'vitest'
import { POST } from './route'

const validPayload = {
  ticketSummary: 'API integration returning 401 after token refresh',
  impact: 'Customer cannot sync data.',
  scope: 'Single customer.',
  timestampWindowStart: '2026-01-15 09:00 UTC',
  timestampWindowEnd: '2026-01-15 09:45 UTC',
  reproSteps: ['Refresh the token', 'Call GET /v1/widgets'],
  requestIds: [],
  ruledOut: [],
  ask: 'Confirm the token scope.',
}

function jsonRequest(body: unknown, ip: string): Request {
  return new Request('http://localhost/api/escalation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

describe('POST /api/escalation', () => {
  it('returns a formatted writeup for valid JSON input', async () => {
    const response = await POST(jsonRequest(validPayload, 'esc-test-1'))
    expect(response.status).toBe(200)
    const body = (await response.json()) as { formatted: string }
    expect(body.formatted).toContain('ESCALATION:')
  })

  it('accepts a form-encoded submission (the no-JS path)', async () => {
    const form = new URLSearchParams()
    form.set('ticketSummary', validPayload.ticketSummary)
    form.set('impact', validPayload.impact)
    form.set('scope', validPayload.scope)
    form.set('timestampWindowStart', validPayload.timestampWindowStart)
    form.set('timestampWindowEnd', validPayload.timestampWindowEnd)
    form.append('reproSteps', 'Refresh the token')
    form.append('reproSteps', 'Call GET /v1/widgets')
    form.set('ask', validPayload.ask)

    const request = new Request('http://localhost/api/escalation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-forwarded-for': 'esc-test-2',
      },
      body: form.toString(),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
  })

  it('returns 422 with field-level detail when required fields are missing', async () => {
    const response = await POST(jsonRequest({ ticketSummary: 'Only a summary' }, 'esc-test-3'))
    expect(response.status).toBe(422)
    const body = (await response.json()) as { error: { code: string } }
    expect(body.error.code).toBe('validation_failed')
  })

  it('returns 415 for an unsupported content type', async () => {
    const request = new Request('http://localhost/api/escalation', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'x-forwarded-for': 'esc-test-4' },
      body: 'hello',
    })
    const response = await POST(request)
    expect(response.status).toBe(415)
  })

  it('returns 429 with Retry-After once the rate limit is exceeded', async () => {
    const ip = 'esc-test-rate-limited'
    let lastResponse: Response = await POST(jsonRequest(validPayload, ip))
    for (let i = 0; i < 15; i++) {
      lastResponse = await POST(jsonRequest(validPayload, ip))
    }
    expect(lastResponse.status).toBe(429)
    expect(lastResponse.headers.get('Retry-After')).toBeTruthy()
  })
})
