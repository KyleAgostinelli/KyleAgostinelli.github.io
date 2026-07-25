import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-md border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
      >
        Back to home
      </Link>
    </div>
  )
}
