import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { profile } from '@/content/profile'
import { bodyFont, headingFont } from '@/lib/fonts'
import { parseTheme, THEME_COOKIE_NAME } from '@/lib/theme'
import '../src/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: `${profile.name} - ${profile.title}`,
    template: `%s - ${profile.name}`,
  },
  description: `${profile.title} targeting ${profile.targetRole} roles.`,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Server-read on every request - no client-side flicker fix. Absent cookie means no
  // data-theme attribute at all, and globals.css's `prefers-color-scheme` media query
  // takes over instead. See src/lib/theme.ts and theme-actions.ts.
  const cookieStore = await cookies()
  const theme = parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value)

  return (
    <html lang="en" data-theme={theme} className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className="app-shell bg-canvas font-sans text-ink antialiased">
        <div aria-hidden="true" className="scroll-progress" />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
        >
          Skip to content
        </a>
        <SiteHeader />
        {/* tabIndex={-1} lets the skip link above actually move focus here, not just scroll to it */}
        <main
          id="content"
          tabIndex={-1}
          className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 focus:outline-none"
        >
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
