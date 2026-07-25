# Writing a note

Drop a `.mdx` file in this directory. The filename (minus `.mdx`) becomes the URL slug, so
`token-rotation-retro.mdx` renders at `/notes/token-rotation-retro`.

Every file needs frontmatter matching the schema in `src/content/notes.ts`:

```mdx
---
title: A short, specific title
date: 2026-01-15
summary: One or two sentences - this shows on the /notes index.
---

The body is plain Markdown/MDX. Regular Markdown syntax works; code fences get
syntax-highlighted automatically at build time.

## A heading

\`\`\`ts
const example = 'highlighted via Shiki, server-side'
\`\`\`
```

A malformed or missing frontmatter field fails `next build`, not production - so a typo here
gets caught before it ships.
