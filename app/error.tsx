'use client'

// error.tsx must be a Client Component per Next.js's error-boundary contract.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="text-ink-muted">
        {error.digest
          ? `Reference: ${error.digest}`
          : 'An unexpected error occurred while rendering this page.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-line px-4 py-2 text-sm text-ink hover:border-accent hover:text-accent"
      >
        Try again
      </button>
    </div>
  )
}
