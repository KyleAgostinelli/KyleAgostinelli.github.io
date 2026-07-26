import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import { getAllNotes } from '@/content/notes'
import { buildPageMetadata } from '@/lib/metadata'

export const metadata = buildPageMetadata({
  title: 'Notes',
  description: 'Short, occasional write-ups on support tooling and troubleshooting.',
  path: '/notes',
})

export default function NotesPage() {
  const notes = getAllNotes()

  return (
    <div className="flex flex-col gap-8">
      <BreadcrumbJsonLd
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Notes', path: '/notes' },
        ]}
      />
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">Notes</h1>
        <p className="mt-2 max-w-(--measure) text-pretty text-ink-muted">
          Short, occasional write-ups on support tooling and troubleshooting.
        </p>
      </div>

      {notes.length === 0 ? (
        <p className="text-ink-muted">Nothing published yet.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {notes.map((note) => (
            <li key={note.slug} className="border-t border-line pt-6">
              <Link href={`/notes/${note.slug}`} className="group">
                <h2 className="font-heading text-xl font-semibold text-ink group-hover:text-accent">
                  {note.title}
                </h2>
                <p className="mt-1 text-sm text-ink-muted">{note.date}</p>
                <p className="mt-2 max-w-(--measure) text-pretty text-ink">{note.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
