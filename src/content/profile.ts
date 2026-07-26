import { z } from 'zod'
import { metricSchema, nonEmptyString, urlString } from './schema'

const profileSchema = z.object({
  name: nonEmptyString,
  title: nonEmptyString,
  targetRole: nonEmptyString,
  email: z.email(),
  location: nonEmptyString,
  github: urlString,
  linkedin: urlString,
  resumeHref: nonEmptyString,
  avatar: nonEmptyString,
  metrics: z.array(metricSchema).min(1),
  skillTags: z.array(nonEmptyString).min(1),
})
export type Profile = z.infer<typeof profileSchema>

export const profile: Profile = profileSchema.parse({
  name: 'Kyle Agostinelli',
  title: 'Technical Support Specialist',
  targetRole: 'TSE / Support Specialist II',
  email: 'kyleagostinelli@protonmail.com',
  location: 'Iowa City, IA',
  github: 'https://github.com/KyleAgostinelli',
  linkedin: 'https://www.linkedin.com/in/kyle-agostinelli-075329237/',
  resumeHref: '/KyleAgostinelli-Resume.pdf',
  // Self-hosted (public/avatar.png), downloaded from the real GitHub avatar - the site no
  // longer depends on avatars.githubusercontent.com in its rendering path.
  avatar: '/avatar.png',
  metrics: [
    { label: '95%+ CSAT', value: 'Support quality benchmark', tone: 'success' },
    { label: '<5% transfer', value: 'Escalations kept low at scale', tone: 'info' },
    { label: '50 tickets/day', value: 'High-volume SaaS queue handling', tone: 'warning' },
    {
      label: '9x Most Helpful',
      value: 'Recognized for clarity and customer advocacy',
      tone: 'accent',
    },
  ],
  skillTags: [
    'API Support',
    'SaaS Troubleshooting',
    'Authentication Issues',
    'Cloud-Connected Systems',
    'Networking',
    'Zendesk / Salesforce',
    'O365 Administration',
    'Customer Communication',
  ],
} satisfies z.input<typeof profileSchema>)
