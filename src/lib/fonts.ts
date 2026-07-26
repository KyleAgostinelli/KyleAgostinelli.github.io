import { Inter, Source_Serif_4 } from 'next/font/google'

// display: 'optional' rather than 'swap' - measured in CI (see docs/DECISIONS.md ADR 7):
// even with next/font's automatic fallback-metric matching, swapping from the fallback to
// the downloaded font caused real, measurable CLS (0.018-0.029, confirmed by blocking font
// requests entirely and watching CLS drop to exactly 0). 'optional' gives the browser a very
// short window to use the font if it's already cached and otherwise commits to the
// metric-matched fallback for that page view - no swap, so nothing to shift.
export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'optional',
})

// Source Serif 4 is a variable font with an optical-size (opsz) axis; next/font includes
// all default axes for variable Google Fonts automatically, so headings get real optical
// sizing rather than a single fixed cut scaled up.
export const headingFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-heading-serif',
  display: 'optional',
})
