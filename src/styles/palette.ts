import type { Oklch } from '@/lib/color-contrast'

// Canonical values for the design system's neutral ramp and accent scale, and the
// semantic light/dark role mappings built on them. This file is the source of truth for
// the contrast-ratio test suite (see palette.test.ts).
//
// Tailwind v4's @theme block has to be literal CSS - it cannot import these values - so
// globals.css mirrors these exact numbers into its own oklch() declarations. If you change
// a value here, change it there too; the two are kept in sync by discipline, not by a build
// step, which is a deliberate tradeoff against adding a codegen pipeline for a palette this
// small.

const NEUTRAL_HUE = 260
const ACCENT_HUE = 250

export const neutral = {
  50: { l: 0.985, c: 0.002, h: NEUTRAL_HUE },
  100: { l: 0.967, c: 0.003, h: NEUTRAL_HUE },
  200: { l: 0.92, c: 0.004, h: NEUTRAL_HUE },
  300: { l: 0.85, c: 0.006, h: NEUTRAL_HUE },
  400: { l: 0.71, c: 0.008, h: NEUTRAL_HUE },
  500: { l: 0.56, c: 0.012, h: NEUTRAL_HUE },
  600: { l: 0.44, c: 0.014, h: NEUTRAL_HUE },
  700: { l: 0.35, c: 0.014, h: NEUTRAL_HUE },
  800: { l: 0.27, c: 0.012, h: NEUTRAL_HUE },
  900: { l: 0.2, c: 0.01, h: NEUTRAL_HUE },
  950: { l: 0.14, c: 0.008, h: NEUTRAL_HUE },
} as const satisfies Record<number, Oklch>

export const accent = {
  400: { l: 0.7, c: 0.14, h: ACCENT_HUE },
  500: { l: 0.6, c: 0.16, h: ACCENT_HUE },
  600: { l: 0.5, c: 0.17, h: ACCENT_HUE },
  700: { l: 0.42, c: 0.16, h: ACCENT_HUE },
} as const satisfies Record<number, Oklch>

// Keys match globals.css's CSS custom property names (--color-canvas, --color-ink, etc.)
// minus the --color- prefix, so the mapping between this file and the shipped CSS is
// unambiguous at a glance.
export const semantic = {
  light: {
    canvas: neutral[50],
    ink: neutral[950],
    inkMuted: neutral[600],
    line: neutral[200],
    accentColor: accent[600],
    accentHover: accent[700],
    accentContrast: neutral[50],
  },
  dark: {
    canvas: neutral[950],
    ink: neutral[50],
    inkMuted: neutral[400],
    line: neutral[800],
    accentColor: accent[400],
    accentHover: accent[500],
    accentContrast: neutral[950],
  },
} as const
