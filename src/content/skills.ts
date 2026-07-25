import { z } from 'zod'
import { nonEmptyString } from './schema'

const skillGroupSchema = z.object({
  label: nonEmptyString,
  skills: z.array(nonEmptyString).min(1),
})
export type SkillGroup = z.infer<typeof skillGroupSchema>

const skillsSchema = z.object({
  groups: z.array(skillGroupSchema).min(1),
})
export type Skills = z.infer<typeof skillsSchema>

export const skills: Skills = skillsSchema.parse({
  groups: [
    {
      label: 'API + SaaS Support',
      skills: [
        'API Support',
        'Authentication',
        'Integrations',
        'Product Support',
        'Software Support',
      ],
    },
    {
      label: 'Systems + IT',
      skills: [
        'DNS / DHCP / VLANs / TCP-IP',
        'Windows / macOS',
        'Active Directory / Azure AD',
        'O365 Administration',
      ],
    },
    {
      label: 'Support Operations',
      skills: [
        'Zendesk / Salesforce',
        'Ticket Triage',
        'Customer Communication',
        'Process Improvement',
      ],
    },
    {
      label: 'Web Foundations',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    },
  ],
} satisfies z.input<typeof skillsSchema>)
