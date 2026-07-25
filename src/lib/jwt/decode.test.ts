import { describe, expect, it } from 'vitest'
import { decodeJwt } from './decode'

// Fixtures below have a fake, unverified signature segment - decodeJwt never checks it
// (there is no signing key available client-side, and this tool explicitly does not claim
// to verify signatures).
const VALID_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3ODUwMTM2NjQsInNjb3BlIjoicmVhZCB3cml0ZSJ9.fakesignature'
const EXPIRED_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZXhwIjoxNzg1MDA2NDY0fQ.fakesignature'
const NO_EXP_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik5vIEV4cGlyeSJ9.fakesignature'

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
