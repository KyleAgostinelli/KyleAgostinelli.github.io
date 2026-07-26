import { profile } from '@/content/profile'
import { siteUrl } from '@/lib/metadata'

// Rendering raw JSON as a <script> tag is the documented Next.js pattern for JSON-LD - search
// engines read it regardless of where in the document it lands, and there's no user-supplied
// data flowing through dangerouslySetInnerHTML here (every value below comes from this
// project's own validated content modules, never from a request).
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}

/** Person structured data - rendered once, on the homepage only. */
export function PersonJsonLd() {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.name,
        jobTitle: profile.title,
        email: `mailto:${profile.email}`,
        url: siteUrl,
        address: { '@type': 'PostalAddress', addressLocality: profile.location },
        sameAs: [profile.github, profile.linkedin],
        knowsAbout: profile.skillTags,
      }}
    />
  )
}

interface Crumb {
  name: string
  path: string
}

/** BreadcrumbList structured data for any route below the homepage. */
export function BreadcrumbJsonLd({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.path}`,
        })),
      }}
    />
  )
}

interface TechArticleInput {
  headline: string
  description: string
  path: string
  datePublished?: string
}

/** TechArticle structured data for the case study and individual notes posts. */
export function TechArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
}: TechArticleInput) {
  return (
    <JsonLdScript
      data={{
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline,
        description,
        url: `${siteUrl}${path}`,
        author: { '@type': 'Person', name: profile.name, url: siteUrl },
        ...(datePublished ? { datePublished } : {}),
      }}
    />
  )
}
