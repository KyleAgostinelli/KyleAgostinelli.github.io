import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import rehypePrettyCode from 'rehype-pretty-code'
import { getAllNotes, getNoteBySlug } from '@/content/notes'

export function generateStaticParams(): { slug: string }[] {
  return getAllNotes().map((note) => ({ slug: note.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const note = getNoteBySlug(slug)
  return { title: note?.title ?? 'Note' }
}

// Shiki highlights at build/request time on the server via this rehype plugin - no
// highlighter ships to the client. Fixed to one theme rather than a light/dark pair: with
// zero real notes published yet, wiring rehype-pretty-code's dual-theme CSS-variable output
// to this site's data-theme mechanism has nothing real to verify against. Worth revisiting
// once there's an actual code-heavy note to check it against.
const rehypePrettyCodeOptions = { theme: 'github-dark' }

const proseClassName =
  'max-w-(--measure) text-pretty text-ink ' +
  '[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold ' +
  '[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold ' +
  '[&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 ' +
  '[&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 ' +
  '[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:text-sm ' +
  '[&_code]:rounded-sm [&_code]:bg-line [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm ' +
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0'

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const note = getNoteBySlug(slug)

  if (!note) {
    notFound()
  }

  return (
    <article className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance font-heading text-3xl font-semibold text-ink">{note.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{note.date}</p>
      </div>
      <div className={proseClassName}>
        <MDXRemote
          source={note.content}
          options={{
            mdxOptions: {
              rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
            },
          }}
        />
      </div>
    </article>
  )
}
