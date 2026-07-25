import { Inter, Source_Serif_4 } from 'next/font/google'

export const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Source Serif 4 is a variable font with an optical-size (opsz) axis; next/font includes
// all default axes for variable Google Fonts automatically, so headings get real optical
// sizing rather than a single fixed cut scaled up.
export const headingFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-heading-serif',
  display: 'swap',
})
