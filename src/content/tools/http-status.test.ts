import { describe, expect, it } from 'vitest'
import { categoryForCode, getHttpStatusEntry } from './http-status'

describe('categoryForCode', () => {
  it('classifies boundary values correctly', () => {
    expect(categoryForCode(200)).toBe('success')
    expect(categoryForCode(299)).toBe('success')
    expect(categoryForCode(300)).toBe('redirection')
    expect(categoryForCode(399)).toBe('redirection')
    expect(categoryForCode(400)).toBe('client-error')
    expect(categoryForCode(499)).toBe('client-error')
    expect(categoryForCode(500)).toBe('server-error')
    expect(categoryForCode(599)).toBe('server-error')
  })
})

describe('getHttpStatusEntry', () => {
  it('returns a curated entry for a known code', () => {
    const entry = getHttpStatusEntry(404)
    expect(entry?.reasonPhrase).toBe('Not Found')
    expect(entry?.commonCauses.length).toBeGreaterThan(0)
  })

  it('returns undefined for a code outside the curated set', () => {
    expect(getHttpStatusEntry(418)).toBeUndefined()
  })

  it('flags 204 and 304 as null-body, and everything else as not', () => {
    expect(getHttpStatusEntry(204)?.nullBody).toBe(true)
    expect(getHttpStatusEntry(304)?.nullBody).toBe(true)
    expect(getHttpStatusEntry(200)?.nullBody).toBe(false)
    expect(getHttpStatusEntry(404)?.nullBody).toBe(false)
  })
})
