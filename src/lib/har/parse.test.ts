import { describe, expect, it } from 'vitest'
import { analyzeHar } from './parse'

function harEntry(overrides: {
  method?: string
  url?: string
  status?: number
  requestHeaders?: { name: string; value: string }[]
  responseHeaders?: { name: string; value: string }[]
  redirectURL?: string
  time?: number
}) {
  return {
    time: overrides.time ?? 50,
    request: {
      method: overrides.method ?? 'GET',
      url: overrides.url ?? 'https://api.example.com/widgets',
      headers: overrides.requestHeaders ?? [],
    },
    response: {
      status: overrides.status ?? 200,
      statusText: 'OK',
      headers: overrides.responseHeaders ?? [],
      redirectURL: overrides.redirectURL ?? '',
    },
  }
}

function harFile(entries: ReturnType<typeof harEntry>[]) {
  return { log: { entries } }
}

describe('analyzeHar', () => {
  it('rejects input that matches neither supported format', () => {
    const result = analyzeHar({ not: 'a har file' })
    expect(result.success).toBe(false)
  })

  it('flags a failed request (4xx/5xx)', () => {
    const result = analyzeHar(harFile([harEntry({ status: 500 })]))
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(
      result.summary.findings.some((f) => f.type === 'failed-request' && f.status === 500),
    ).toBe(true)
  })

  it('flags a missing Authorization header on a 401', () => {
    const result = analyzeHar(harFile([harEntry({ status: 401 })]))
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type === 'auth-missing')).toBe(true)
  })

  it('flags a malformed Authorization header regardless of status', () => {
    const result = analyzeHar(
      harFile([
        harEntry({ requestHeaders: [{ name: 'Authorization', value: 'garbage-no-scheme' }] }),
      ]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type === 'auth-malformed')).toBe(true)
  })

  it('does not flag auth findings when a well-formed Authorization header is present', () => {
    const result = analyzeHar(
      harFile([harEntry({ requestHeaders: [{ name: 'Authorization', value: 'Bearer abc123' }] })]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type.startsWith('auth-'))).toBe(false)
  })

  it('redacts the Authorization value and never echoes it back', () => {
    const secret = 'Bearer super-secret-token-value'
    const result = analyzeHar(
      harFile([harEntry({ requestHeaders: [{ name: 'Authorization', value: secret }] })]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(JSON.stringify(result.summary)).not.toContain('super-secret-token-value')
  })

  it('flags a CORS preflight failure when Access-Control-Allow-Origin is missing', () => {
    const result = analyzeHar(
      harFile([harEntry({ method: 'OPTIONS', status: 204, responseHeaders: [] })]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type === 'cors-preflight-failure')).toBe(true)
  })

  it('does not flag a CORS preflight that returns the expected header', () => {
    const result = analyzeHar(
      harFile([
        harEntry({
          method: 'OPTIONS',
          status: 204,
          responseHeaders: [{ name: 'Access-Control-Allow-Origin', value: '*' }],
        }),
      ]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type === 'cors-preflight-failure')).toBe(false)
  })

  it('flags a redirect', () => {
    const result = analyzeHar(
      harFile([harEntry({ status: 301, redirectURL: 'https://api.example.com/v2/widgets' })]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type === 'redirect-chain')).toBe(true)
  })

  it('flags a slow request above the threshold, not one below it', () => {
    const result = analyzeHar(
      harFile([
        harEntry({ time: 2000 }),
        harEntry({ time: 100, url: 'https://api.example.com/fast' }),
      ]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    const slow = result.summary.findings.filter((f) => f.type === 'slow-request')
    expect(slow).toHaveLength(1)
    expect(slow[0]?.url).toBe('https://api.example.com/widgets')
  })

  it('flags mixed content when an http:// request appears alongside https:// requests', () => {
    const result = analyzeHar(
      harFile([
        harEntry({ url: 'https://api.example.com/secure' }),
        harEntry({ url: 'http://api.example.com/insecure' }),
      ]),
    )
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings.some((f) => f.type === 'mixed-content')).toBe(true)
  })

  it('accepts the simplified {entries: [...]} request/response pair format', () => {
    const result = analyzeHar({
      entries: [
        {
          method: 'GET',
          url: 'https://api.example.com/widgets',
          status: 404,
          requestHeaders: {},
          responseHeaders: {},
        },
      ],
    })
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.totalRequests).toBe(1)
    expect(result.summary.findings.some((f) => f.type === 'failed-request')).toBe(true)
  })

  it('reports a clean summary with zero findings for an unremarkable trace', () => {
    const result = analyzeHar(harFile([harEntry({})]))
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.summary.findings).toHaveLength(0)
  })
})
