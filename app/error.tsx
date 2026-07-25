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
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        {error.digest
          ? `Reference: ${error.digest}`
          : 'An unexpected error occurred while rendering this page.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
      >
        Try again
      </button>
    </div>
  )
}
