import type { Metadata } from 'next'
import { profile } from '@/content/profile'

// The real, canonical production URL - used for metadataBase, canonical links, OG/Twitter
// absolute URLs, sitemap.ts, robots.ts, and JSON-LD. One constant, so it only needs to
// change in one place if the Vercel domain ever changes again.
export const siteUrl = 'https://kyleagostinelli.vercel.app'

interface PageMetadataInput {
  /** Short page title - the root layout's title template appends " - Kyle Agostinelli". */
  title: string
  description: string
  /** Path from the site root, e.g. "/work" or "/tools/jwt". "" for the homepage. */
  path: string
}

/**
 * Builds a complete per-page Metadata object (description, canonical, OpenGraph, Twitter).
 * Next.js shallow-merges parent/child metadata - a child that sets `openGraph` at all
 * replaces the parent's whole object rather than merging field-by-field - so every route
 * that wants a correct per-page OG title/description builds its own complete object here
 * instead of relying on partial inheritance from the root layout.
 */
export function buildPageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const url = `${siteUrl}${path}`
  const ogTitle = `${title} - ${profile.name}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: profile.name,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  }
}
