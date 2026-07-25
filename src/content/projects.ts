import { z } from 'zod'
import { nonEmptyString } from './schema'

const projectSchema = z.object({
  name: nonEmptyString,
  stage: nonEmptyString,
  summary: nonEmptyString,
  supportAngle: nonEmptyString,
  details: z.array(nonEmptyString).min(1),
  signals: z.array(nonEmptyString).min(1),
})
export type Project = z.infer<typeof projectSchema>

export const projects: Project[] = z
  .array(projectSchema)
  .min(1)
  .parse([
    {
      name: 'DxId / Layer0',
      stage: 'Architecture concept, early build',
      summary:
        'An identity-aware cross-chain interoperability concept: how identity context and trust follow a user or asset across chains rather than resetting at every boundary.',
      supportAngle:
        'Useful in interviews as a systems-thinking example: identity context, integration assumptions, and failure boundaries between systems that do not trust each other by default.',
      details: [
        'Focuses on cross-chain identity context and trust-aware routing.',
        'Designed to support modular systems that can integrate with future app chains.',
        'A protocol-design exercise, not a shipped product.',
      ],
      signals: ['Identity context', 'Interoperability', 'Failure-boundary thinking'],
    },
    {
      name: 'Longyield L1',
      stage: 'Protocol design',
      summary:
        'An L1 design exploring long-horizon staking and validator economics, aimed at predictable incentives over short-term yield.',
      supportAngle:
        'Shows comfort with technical tradeoffs, reliability framing, and explaining incentive design without losing a non-technical reader.',
      details: [
        'Explores staking and yield mechanics for long-term participant incentives.',
        'Emphasizes predictable validator economics over short-term throughput.',
        'A research-stage design, not a deployed network.',
      ],
      signals: ['Protocol design', 'Reliability framing', 'Technical communication'],
    },
  ] satisfies z.input<typeof projectSchema>[])
