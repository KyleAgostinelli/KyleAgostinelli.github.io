import { describe, expect, it } from 'vitest'
import { parseTheme } from './theme'

describe('parseTheme', () => {
  it('accepts "light" and "dark"', () => {
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('dark')).toBe('dark')
  })

  it('treats anything else as unset', () => {
    expect(parseTheme(undefined)).toBeUndefined()
    expect(parseTheme('')).toBeUndefined()
    expect(parseTheme('Dark')).toBeUndefined()
    expect(parseTheme('system')).toBeUndefined()
  })
})
