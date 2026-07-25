import { describe, expect, it } from 'vitest'
import { formatEscalation } from './format'
import type { EscalationInput } from './schema'

const baseInput: EscalationInput = {
  ticketSummary: 'API integration returning 401 after token refresh',
  impact: 'Customer cannot sync data; integration fully blocked.',
  scope: 'Single customer, all API calls from their integration.',
  timestampWindowStart: '2026-01-15 09:00 UTC',
  timestampWindowEnd: '2026-01-15 09:45 UTC',
  reproSteps: ['Refresh the token', 'Call GET /v1/widgets with the new token'],
  requestIds: [],
  ruledOut: [],
  ask: 'Confirm the refreshed token was issued with the correct scope.',
}

describe('formatEscalation', () => {
  it('includes the required sections in order', () => {
    const output = formatEscalation(baseInput)
    expect(output).toContain('ESCALATION: API integration returning 401 after token refresh')
    expect(output).toContain('Impact: Customer cannot sync data; integration fully blocked.')
    expect(output).toContain('Scope: Single customer, all API calls from their integration.')
    expect(output).toContain('Timestamp window: 2026-01-15 09:00 UTC to 2026-01-15 09:45 UTC')
    expect(output).toContain('1. Refresh the token')
    expect(output).toContain('2. Call GET /v1/widgets with the new token')
    expect(output).toContain('Ask:')
    expect(output).toContain('Confirm the refreshed token was issued with the correct scope.')
  })

  it('omits the Request IDs section when none are given', () => {
    expect(formatEscalation(baseInput)).not.toContain('Request IDs:')
  })

  it('includes Request IDs when provided', () => {
    const output = formatEscalation({ ...baseInput, requestIds: ['req_123', 'req_456'] })
    expect(output).toContain('Request IDs:')
    expect(output).toContain('- req_123')
    expect(output).toContain('- req_456')
  })

  it('omits the Ruled out section when empty, includes it when populated', () => {
    expect(formatEscalation(baseInput)).not.toContain('Ruled out:')
    const output = formatEscalation({ ...baseInput, ruledOut: ['Not a client-side caching issue'] })
    expect(output).toContain('Ruled out:')
    expect(output).toContain('- Not a client-side caching issue')
  })

  it('defaults to "transferred per standard procedure" when there is no pre-transfer note', () => {
    const output = formatEscalation(baseInput)
    expect(output).not.toContain('Pre-transfer note')
    expect(output).toContain('transferred to L2 per standard procedure')
  })

  it('includes the pre-transfer note and a different closing line when one is given', () => {
    const output = formatEscalation({
      ...baseInput,
      preTransferNote:
        'Confirmed with L2 this looks like a scope issue, not a client bug, before handing off.',
    })
    expect(output).toContain('Pre-transfer note (discussed with L2 before handoff):')
    expect(output).toContain('Confirmed with L2 this looks like a scope issue')
    expect(output).toContain('discussed with L2 before transfer per the note above')
    expect(output).not.toContain('transferred to L2 per standard procedure')
  })
})
