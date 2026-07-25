import { z } from 'zod'

// Field shape follows Kyle's actual escalation procedure, not a generic SEV/priority
// template: log the ticket fully as if solving it directly, then transfer to L2 - only with
// a pre-transfer note if something specific needed flagging before handoff.
export const escalationInputSchema = z.object({
  ticketSummary: z.string().trim().min(1, 'Summarize the ticket in one line.'),
  impact: z.string().trim().min(1, 'Describe the customer/business impact.'),
  scope: z.string().trim().min(1, 'Describe how widespread this is.'),
  timestampWindowStart: z.string().trim().min(1, 'When did this start?'),
  timestampWindowEnd: z.string().trim().min(1, 'When was it last observed?'),
  reproSteps: z.array(z.string().trim().min(1)).min(1, 'Include at least one repro step.'),
  requestIds: z.array(z.string().trim().min(1)).default([]),
  ruledOut: z.array(z.string().trim().min(1)).default([]),
  preTransferNote: z.string().trim().optional(),
  ask: z.string().trim().min(1, 'State what you need L2 to do.'),
})
export type EscalationInput = z.infer<typeof escalationInputSchema>
