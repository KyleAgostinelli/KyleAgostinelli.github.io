import { describe, expect, it } from 'vitest'
import { checkRateLimit, getClientKey } from './rate-limit'

function uniqueKey(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}

describe('checkRateLimit', () => {
  it('allows requests up to the limit within the window', () => {
    const key = uniqueKey('test')
    expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true)
    expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true)
    expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true)
  })

  it('rejects the request once the limit is exceeded, with a positive retryAfterSeconds', () => {
    const key = uniqueKey('test')
    checkRateLimit(key, 2, 60_000)
    checkRateLimit(key, 2, 60_000)
    const result = checkRateLimit(key, 2, 60_000)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })

  it('tracks separate keys independently', () => {
    const keyA = uniqueKey('test-a')
    const keyB = uniqueKey('test-b')
    checkRateLimit(keyA, 1, 60_000)
    expect(checkRateLimit(keyA, 1, 60_000).allowed).toBe(false)
    expect(checkRateLimit(keyB, 1, 60_000).allowed).toBe(true)
  })

  it('resets the count once the window has elapsed', () => {
    const key = uniqueKey('test')
    checkRateLimit(key, 1, 10)
    expect(checkRateLimit(key, 1, 10).allowed).toBe(false)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(checkRateLimit(key, 1, 10).allowed).toBe(true)
        resolve()
      }, 20)
    })
  })
})

describe('getClientKey', () => {
  it('reads the first entry of x-forwarded-for', () => {
    const request = new Request('http://localhost/', {
      headers: { 'x-forwarded-for': '203.0.113.5, 10.0.0.1' },
    })
    expect(getClientKey(request)).toBe('203.0.113.5')
  })

  it('falls back to "unknown" when the header is absent', () => {
    const request = new Request('http://localhost/')
    expect(getClientKey(request)).toBe('unknown')
  })
})
