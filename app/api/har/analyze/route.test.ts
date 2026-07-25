import { describe, expect, it } from 'vitest'
import { POST } from './route'

function jsonRequest(body: string, ip: string): Request {
  return new Request('http://localhost/api/har/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body,
  })
}

const validHar = JSON.stringify({
  log: {
    entries: [
      {
        time: 10,
        request: { method: 'GET', url: 'https://api.example.com/widgets', headers: [] },
        response: { status: 200, statusText: 'OK', headers: [], redirectURL: '' },
      },
    ],
  },
})

describe('POST /api/har/analyze', () => {
  it('returns a summary for a valid HAR body sent as JSON', async () => {
    const response = await POST(jsonRequest(validHar, 'route-test-1'))
    expect(response.status).toBe(200)
    const body = (await response.json()) as { summary: { totalRequests: number } }
    expect(body.summary.totalRequests).toBe(1)
  })

  it('accepts a form-encoded submission with a "har" field (the no-JS path)', async () => {
    const form = new URLSearchParams({ har: validHar })
    const request = new Request('http://localhost/api/har/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-forwarded-for': 'route-test-2',
      },
      body: form.toString(),
    })
    const response = await POST(request)
    expect(response.status).toBe(200)
  })

  it('returns 400 for malformed JSON', async () => {
    const response = await POST(jsonRequest('{ not valid json', 'route-test-3'))
    expect(response.status).toBe(400)
    const body = (await response.json()) as { error: { code: string } }
    expect(body.error.code).toBe('invalid_json')
  })

  it('returns 422 for valid JSON that matches neither supported shape', async () => {
    const response = await POST(jsonRequest(JSON.stringify({ nope: true }), 'route-test-4'))
    expect(response.status).toBe(422)
    const body = (await response.json()) as { error: { code: string } }
    expect(body.error.code).toBe('unrecognized_format')
  })

  it('returns 415 for an unsupported content type', async () => {
    const request = new Request('http://localhost/api/har/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain', 'x-forwarded-for': 'route-test-5' },
      body: 'hello',
    })
    const response = await POST(request)
    expect(response.status).toBe(415)
  })

  it('returns 413 for a payload over the size cap', async () => {
    const hugeText = 'x'.repeat(3 * 1024 * 1024 + 1)
    const response = await POST(jsonRequest(hugeText, 'route-test-6'))
    expect(response.status).toBe(413)
  })

  it('returns 429 with Retry-After once the rate limit is exceeded', async () => {
    const ip = 'route-test-rate-limited'
    let lastResponse: Response = await POST(jsonRequest(validHar, ip))
    for (let i = 0; i < 15; i++) {
      lastResponse = await POST(jsonRequest(validHar, ip))
    }
    expect(lastResponse.status).toBe(429)
    expect(lastResponse.headers.get('Retry-After')).toBeTruthy()
  })
})
