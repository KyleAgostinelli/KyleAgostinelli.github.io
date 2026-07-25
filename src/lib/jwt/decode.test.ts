import { describe, expect, it } from 'vitest'
import { decodeJwt } from './decode'

// Fixtures are built at test-run time relative to the current clock, not hardcoded absolute
// timestamps - an earlier version of this file baked in a fixed future exp, which
// (correctly, in hindsight) started failing once real time caught up to it.
function base64UrlEncode(value: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url')
}

function makeJwt(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.fakesignature`
}

const NOW_SECONDS = Math.floor(Date.now() / 1000)

const VALID_JWT = makeJwt({
  sub: '1234567890',
  name: 'John Doe',
  iat: NOW_SECONDS - 100,
  exp: NOW_SECONDS + 3600,
  scope: 'read write',
})
const EXPIRED_JWT = makeJwt({ sub: '1234567890', exp: NOW_SECONDS - 3600 })
const NO_EXP_JWT = makeJwt({ sub: '1234567890', name: 'No Expiry' })

describe('decodeJwt', () => {
  it('decodes a valid token into header, claims, expiry, and scope', () => {
    const result = decodeJwt(VALID_JWT)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.decoded.header).toMatchObject({ alg: 'HS256', typ: 'JWT' })
    expect(result.decoded.payload).toMatchObject({ sub: '1234567890', name: 'John Doe' })
    expect(result.decoded.scope).toEqual(['read', 'write'])
    expect(result.decoded.expiry.isExpired).toBe(false)
    expect(result.decoded.expiry.relativeDescription).toMatch(/expires in/)
  })

  it('reports an expired token as expired, with a relative description', () => {
    const result = decodeJwt(EXPIRED_JWT)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.decoded.expiry.isExpired).toBe(true)
    expect(result.decoded.expiry.relativeDescription).toMatch(/expired/)
  })

  it('handles a token with no exp claim without crashing', () => {
    const result = decodeJwt(NO_EXP_JWT)
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.decoded.expiry.exp).toBeNull()
    expect(result.decoded.expiry.isExpired).toBeNull()
    expect(result.decoded.expiry.relativeDescription).toBeNull()
    expect(result.decoded.scope).toBeNull()
  })

  it('rejects a string with the wrong number of segments', () => {
    const result = decodeJwt('only.two')
    expect(result.success).toBe(false)
  })

  it('rejects a token whose header segment is not valid base64url JSON', () => {
    const result = decodeJwt('not-valid-base64!!.eyJzdWIiOiIxIn0.sig')
    expect(result.success).toBe(false)
  })

  it('rejects a token whose payload decodes to a JSON array instead of an object', () => {
    const arrayPayload = Buffer.from('[1,2,3]').toString('base64url')
    const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
    const result = decodeJwt(`${header}.${arrayPayload}.sig`)
    expect(result.success).toBe(false)
  })
})
