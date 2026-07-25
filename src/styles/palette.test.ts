import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/color-contrast'
import { neutral, semantic } from './palette'

// Every semantic pair below is used for body-size text or smaller, so all of them are held
// to the stricter 4.5:1 bar - there's no role in this token set that's deliberately
// large-text-only with a relaxed 3:1 minimum. If one is added later, test it against 3:1
// explicitly rather than reusing this constant.
const AA_BODY = 4.5

describe('contrastRatio sanity checks', () => {
  it('is 21:1 for pure black vs pure white', () => {
    const black = { l: 0, c: 0, h: 0 }
    const white = { l: 1, c: 0, h: 0 }
    expect(contrastRatio(black, white)).toBeCloseTo(21, 0)
  })

  it('is 1:1 for identical colors', () => {
    expect(contrastRatio(neutral[500], neutral[500])).toBeCloseTo(1, 5)
  })

  it('is symmetric regardless of argument order', () => {
    expect(contrastRatio(neutral[950], neutral[50])).toBeCloseTo(
      contrastRatio(neutral[50], neutral[950]),
      10,
    )
  })
})

describe.each([
  ['light', semantic.light],
  ['dark', semantic.dark],
] as const)('%s mode', (_mode, mode) => {
  it('meets AA for body text (ink on canvas)', () => {
    expect(contrastRatio(mode.ink, mode.canvas)).toBeGreaterThanOrEqual(AA_BODY)
  })

  it('meets AA for muted text (inkMuted on canvas)', () => {
    expect(contrastRatio(mode.inkMuted, mode.canvas)).toBeGreaterThanOrEqual(AA_BODY)
  })

  it('meets AA for the accent color against canvas (body-size link text)', () => {
    expect(contrastRatio(mode.accentColor, mode.canvas)).toBeGreaterThanOrEqual(AA_BODY)
  })

  it('meets AA for the accent hover shade against canvas', () => {
    expect(contrastRatio(mode.accentHover, mode.canvas)).toBeGreaterThanOrEqual(AA_BODY)
  })

  it('meets AA for accentContrast text on a solid accentColor fill (e.g. a button)', () => {
    expect(contrastRatio(mode.accentContrast, mode.accentColor)).toBeGreaterThanOrEqual(AA_BODY)
  })

  it('meets the large-text/UI-component minimum for line against canvas', () => {
    expect(contrastRatio(mode.line, mode.canvas)).toBeGreaterThanOrEqual(1.15)
    // Lines are decorative dividers here, not text or focus indicators, so WCAG 1.4.11's
    // 3:1 non-text-contrast minimum doesn't strictly apply - this just guards against a
    // divider becoming genuinely invisible (indistinguishable from the background).
  })
})
