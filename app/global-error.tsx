'use client'

// global-error.tsx replaces the root layout entirely when layout.tsx itself throws, so it
// has to render its own <html>/<body>. Client Component per Next.js's error-boundary contract.

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-neutral-900">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
