import { z } from 'zod'
import { nonEmptyString } from './schema'

const supportCaseSchema = z.object({
  id: nonEmptyString,
  slug: nonEmptyString,
  title: nonEmptyString,
  severity: nonEmptyString,
  status: nonEmptyString,
  summary: nonEmptyString,
  symptoms: z.array(nonEmptyString).min(1),
  evidence: z.array(nonEmptyString).min(1),
  likelyRootCause: nonEmptyString,
  troubleshootingSteps: z.array(nonEmptyString).min(1),
  escalationNotes: nonEmptyString,
  customerSummary: nonEmptyString,
})
export type SupportCase = z.infer<typeof supportCaseSchema>

export const supportCase: SupportCase = supportCaseSchema.parse({
  id: 'case_auth_failure',
  slug: 'token-rotation-401',
  title: 'API auth failure after token rotation',
  severity: 'SEV-2, customer integration degraded',
  status: 'Resolved with clear repro and next-step guidance',
  summary:
    'A SaaS customer reported that a previously healthy integration began returning 401 errors after an access token refresh.',
  symptoms: [
    'Webhook delivery succeeds, but follow-up API calls return 401.',
    'Customer confirms the integration worked before a credential rotation.',
    'Retrying with the old token fails, and the new token lacks the expected scope.',
  ],
  evidence: [
    'Response headers indicate a valid request shape but rejected authorization.',
    'Request logs show the integration is calling the correct endpoint.',
    'Scope mismatch appears only after the refresh event.',
  ],
  likelyRootCause:
    'The refreshed credential was issued without the integration scope required by the endpoint.',
  troubleshootingSteps: [
    'Confirm the endpoint, method, and account context before changing anything.',
    'Compare the working request pattern against the failing request.',
    'Validate token scope and rotation history.',
    'Give the customer a minimal repro and a safe credential reissue path.',
  ],
  escalationNotes:
    'Escalate with request IDs, timestamp window, endpoint, token scope evidence, customer impact, and the exact reproduction steps.',
  customerSummary:
    'The integration is reaching the correct API, but the refreshed token does not include the scope required for this endpoint. Reissuing the credential with the integration scope should restore the workflow.',
} satisfies z.input<typeof supportCaseSchema>)

export const cases: SupportCase[] = [supportCase]
