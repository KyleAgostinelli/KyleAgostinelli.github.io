import { z } from 'zod'
import { nonEmptyString } from './schema'

const timelineEntrySchema = z.object({
  role: nonEmptyString,
  company: nonEmptyString,
  period: nonEmptyString,
  detail: z.string().optional(),
})
export type TimelineEntry = z.infer<typeof timelineEntrySchema>

const experienceSchema = z.object({
  timeline: z.array(timelineEntrySchema).min(1),
  achievements: z.array(nonEmptyString).min(1),
  education: z
    .array(
      z.object({
        institution: nonEmptyString,
        credential: nonEmptyString,
        detail: z.string().optional(),
      }),
    )
    .min(1),
})
export type Experience = z.infer<typeof experienceSchema>

export const experience: Experience = experienceSchema.parse({
  timeline: [
    {
      role: 'Technical Consultant',
      company: 'Gerson Lehrman Group (GLG)',
      period: 'Jan 2024 - Present',
    },
    { role: 'Technical Support Specialist', company: 'Samsara', period: 'Feb 2023 - Mar 2024' },
    { role: 'Technical Sales Specialist', company: 'Asurion', period: 'May 2021 - Feb 2023' },
    {
      role: 'Technical Support Specialist',
      company: 'Cable One (Sparklight)',
      period: 'May 2021 - Feb 2023',
    },
    {
      role: 'IT Administrator',
      company: 'Calculated Fire Protection',
      period: 'Aug 2018 - Aug 2019',
      detail:
        "A hard drive corrupted right before a sprinkler job was ready to go out, taking the completed project files with it: $20K+ in technical drawings, a licensed engineer's sign-off on them that pushed the package's value past $100K, and $50K+ in supporting calculations. I found an open-source data recovery tool, worked through a guide for pulling files off a corrupted partition, and isolated the drawing PDFs out of what I recovered.",
    },
  ],
  achievements: [
    'Handled up to 50 SaaS support tickets per day while resolving API, authentication, and integration issues.',
    'Maintained 95%+ CSAT with a transfer rate under 5% in a high-growth support environment.',
    'Recognized 9 times as "Most Helpful" for technical clarity and customer advocacy.',
    'Resolved 97% of tickets on first contact at Cable One and advanced into business support cases.',
    'Recovered $100K+ in critical project data while serving as IT Administrator at Calculated Fire Protection.',
  ],
  education: [
    {
      institution: 'SUNY Orange County Community College',
      credential: 'Associate of Science in Engineering',
      detail: '4.0 GPA',
    },
    {
      institution: 'IBM (Coursera)',
      credential: 'HTML, CSS and JavaScript + Cloud Computing',
    },
  ],
} satisfies z.input<typeof experienceSchema>)
