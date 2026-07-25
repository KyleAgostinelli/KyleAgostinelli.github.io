import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="font-heading text-2xl font-semibold text-ink">Page not found</h1>
      <p className="text-ink-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-md border border-line px-4 py-2 text-sm text-ink hover:border-accent hover:text-accent"
      >
        Back to home
      </Link>
    </div>
  )
}
