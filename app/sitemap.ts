import type { MetadataRoute } from 'next'
import { cases } from '@/content/cases'
import { getAllNotes } from '@/content/notes'
import { siteUrl } from '@/lib/metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/work',
    '/about',
    '/contact',
    '/notes',
    '/tools',
    '/tools/status',
    '/tools/har',
    '/tools/jwt',
    '/tools/escalation',
    '/tools/dns',
  ]

  const caseRoutes = cases.map((c) => `/work/${c.slug}`)
  const noteRoutes = getAllNotes().map((note) => `/notes/${note.slug}`)

  return [...staticRoutes, ...caseRoutes, ...noteRoutes].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }))
}
