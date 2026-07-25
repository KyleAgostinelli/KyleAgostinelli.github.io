import type { Metadata } from 'next'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { profile } from '@/content/profile'
import '../src/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: `${profile.name} - ${profile.title}`,
    template: `%s - ${profile.name}`,
  },
  description: `${profile.title} targeting ${profile.targetRole} roles.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
