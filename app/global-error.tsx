'use client'

// global-error.tsx replaces the root layout entirely when layout.tsx itself throws, so it
// has to render its own <html>/<body>. Client Component per Next.js's error-boundary contract.
// It intentionally does not read the theme cookie (layout.tsx is what's broken here) -
// globals.css's prefers-color-scheme fallback still applies since no data-theme is set.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas text-ink">
        <h1 className="font-heading text-2xl font-semibold">Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-line px-4 py-2 text-sm hover:border-accent hover:text-accent"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
