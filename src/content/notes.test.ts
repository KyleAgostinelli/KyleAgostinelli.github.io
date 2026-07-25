import { describe, expect, it } from 'vitest'
import { parseNote } from './notes'

const validRaw = `---
title: Test note
date: 2026-01-15
summary: A short summary of the note.
---

Body content, **with** some markdown.
`

describe('parseNote', () => {
  it('parses valid frontmatter and derives the slug from the filename', () => {
    const note = parseNote('my-first-note.mdx', validRaw)
    expect(note).toEqual({
      title: 'Test note',
      date: '2026-01-15',
      summary: 'A short summary of the note.',
      slug: 'my-first-note',
      content: '\nBody content, **with** some markdown.\n',
    })
  })

  it('rejects a malformed date', () => {
    const raw = validRaw.replace('2026-01-15', 'not-a-date')
    expect(() => parseNote('bad-date.mdx', raw)).toThrow()
  })

  it('rejects frontmatter missing a required field', () => {
    const raw = `---
title: Missing summary and date
---

Body.
`
    expect(() => parseNote('incomplete.mdx', raw)).toThrow()
  })
})
