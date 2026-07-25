import type { EscalationInput } from './schema'

function numberedList(items: string[]): string {
  return items.map((item, index) => `${String(index + 1)}. ${item}`).join('\n')
}

function bulletedList(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n')
}

// Mirrors Kyle's actual escalation procedure: document the ticket fully, as if resolving it
// directly, then transfer to L2. A pre-transfer note only appears when something specific
// needed to be flagged before handoff - it is not a standard section every escalation has.
export function formatEscalation(input: EscalationInput): string {
  const sections = [
    `ESCALATION: ${input.ticketSummary}`,
    '',
    `Impact: ${input.impact}`,
    `Scope: ${input.scope}`,
    `Timestamp window: ${input.timestampWindowStart} to ${input.timestampWindowEnd}`,
    '',
    'Reproduction steps:',
    numberedList(input.reproSteps),
  ]

  if (input.requestIds.length > 0) {
    sections.push('', 'Request IDs:', bulletedList(input.requestIds))
  }

  if (input.ruledOut.length > 0) {
    sections.push('', 'Ruled out:', bulletedList(input.ruledOut))
  }

  if (input.preTransferNote) {
    sections.push(
      '',
      'Pre-transfer note (discussed with L2 before handoff):',
      input.preTransferNote,
    )
  }

  sections.push('', 'Ask:', input.ask)
  sections.push(
    '',
    input.preTransferNote
      ? '--- Logged as if resolving directly; discussed with L2 before transfer per the note above.'
      : '--- Logged as if resolving directly, then transferred to L2 per standard procedure.',
  )

  return sections.join('\n')
}
