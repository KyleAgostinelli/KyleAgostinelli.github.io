import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import { nonEmptyString } from './schema'

export const noteFrontmatterSchema = z.object({
  title: nonEmptyString,
  // gray-matter's YAML parser turns an unquoted `date: 2026-01-15` into a native Date
  // (standard YAML timestamp behavior), not a string - accept either and normalize to
  // YYYY-MM-DD, so a note's frontmatter doesn't silently break depending on whether the
  // date happens to be quoted.
  date: z
    .union([z.iso.date(), z.date()])
    .transform((value) => (typeof value === 'string' ? value : value.toISOString().slice(0, 10))),
  summary: nonEmptyString,
})
export type NoteFrontmatter = z.infer<typeof noteFrontmatterSchema>

export interface Note extends NoteFrontmatter {
  slug: string
  content: string
}

const notesDirectory = path.join(process.cwd(), 'src/notes')

function readNoteFilenames(): string[] {
  if (!fs.existsSync(notesDirectory)) return []
  return fs.readdirSync(notesDirectory).filter((filename) => filename.endsWith('.mdx'))
}

// Parses and validates a single note's frontmatter against noteFrontmatterSchema - a
// malformed date or a missing field throws here (which next build hits at build time),
// rather than shipping bad content to production. Exported separately from getAllNotes so
// it can be unit tested against fixture strings without touching the filesystem.
export function parseNote(filename: string, raw: string): Note {
  const { data, content } = matter(raw)
  const frontmatter = noteFrontmatterSchema.parse(data)
  return {
    ...frontmatter,
    slug: filename.replace(/\.mdx$/, ''),
    content,
  }
}

export function getAllNotes(): Note[] {
  return readNoteFilenames()
    .map((filename) =>
      parseNote(filename, fs.readFileSync(path.join(notesDirectory, filename), 'utf8')),
    )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getNoteBySlug(slug: string): Note | undefined {
  return getAllNotes().find((note) => note.slug === slug)
}
