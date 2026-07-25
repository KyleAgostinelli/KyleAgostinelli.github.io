import { z } from 'zod'
import { nonEmptyString } from './schema'

const supportCaseSchema = z.object({
  id: nonEmptyString,
  slug: nonEmptyString,
  title: nonEmptyString,
  role: nonEmptyString,
  summary: nonEmptyString,
  context: nonEmptyString,
  request: z.array(nonEmptyString).min(1),
  approach: z.array(nonEmptyString).min(1),
  verification: nonEmptyString,
  handoff: nonEmptyString,
  outcome: nonEmptyString,
})
export type SupportCase = z.infer<typeof supportCaseSchema>

// This is a real case from Kyle's time at Samsara - see docs/NEEDS_KYLE.md for the specific
// details still needed (the actual customer email, and anything he'd do differently).
export const supportCase: SupportCase = supportCaseSchema.parse({
  id: 'case_samsara_nocode_integration',
  slug: 'samsara-nocode-api-integration',
  title: "Standing up a Samsara API integration through a customer's no-code builder",
  role: 'Technical Support Specialist, Samsara',
  summary:
    "A Samsara customer needed fleet data flowing into another platform he ran his business on, through that platform's built-in no-code integration builder - no custom code, and no engineer on his side to write it. I built and verified the integration myself first, then walked him through setting it up on his own within 24 hours of the original request.",
  context:
    'The customer wanted Samsara data flowing into a separate platform he already used day to day. That platform had its own no-code automation builder, but no engineering resource on his side beyond it - whatever he could configure himself in that tool was the ceiling.',
  request: [
    "Connect Samsara's API to his platform through that platform's no-code builder, with nothing custom-coded on his end.",
    'Leave him with something he could actually maintain afterward, not something that depended on me staying involved.',
  ],
  approach: [
    "Read Samsara's API documentation alongside the documentation for his platform's no-code builder, to understand what each side actually expected - authentication, endpoints, data shapes, and how that tool's connectors were built to receive them.",
    "Built the integration myself first, end to end, rather than sending him a set of steps I hadn't verified.",
  ],
  verification:
    "Ran the integration against his platform and confirmed data was actually flowing correctly before handing anything back - I wasn't going to walk him through steps I hadn't proven myself.",
  handoff:
    'Walked him through setting it up on his own side over email, using the exact configuration I had already verified worked.',
  outcome:
    'He had a working integration within 24 hours of the original request, configured in a way he could maintain without needing to come back to me for it.',
} satisfies z.input<typeof supportCaseSchema>)

export const cases: SupportCase[] = [supportCase]
