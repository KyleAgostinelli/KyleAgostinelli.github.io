import { z } from 'zod'
import { profile } from './profile'
import { nonEmptyString, urlString } from './schema'

const projectSchema = z.object({
  name: nonEmptyString,
  stage: nonEmptyString,
  summary: nonEmptyString,
  supportAngle: nonEmptyString,
  details: z.array(nonEmptyString).min(1),
  signals: z.array(nonEmptyString).min(1),
  repoUrl: urlString.optional(),
})
export type Project = z.infer<typeof projectSchema>

export const projects: Project[] = z
  .array(projectSchema)
  .min(1)
  .parse([
    {
      name: 'This portfolio site',
      stage: 'In active development',
      summary:
        'A from-scratch rebuild of this site: Next.js 15 App Router and TypeScript strict mode, replacing a static React SPA with a real server surface.',
      supportAngle:
        'The most current evidence of how I actually work: migrating an existing codebase, validating data at every trust boundary, and shipping something a technical reviewer can clone and run themselves rather than take my word for.',
      details: [
        "A Zod-validated content layer - a typo in the site's own data fails the build, not production.",
        'A contact form built as a real server action: typed field-level validation, no data loss on a failed submission, and it still works with JavaScript disabled.',
        'A custom color system verified against WCAG AA contrast programmatically, not eyeballed.',
        'Typecheck, lint, format, and a unit test suite all run in CI on every change.',
      ],
      signals: ['TypeScript', 'API and server actions', 'Automated testing', 'CI/CD'],
      repoUrl: `${profile.github}/KyleAgostinelli.github.io`,
    },
  ] satisfies z.input<typeof projectSchema>[])
