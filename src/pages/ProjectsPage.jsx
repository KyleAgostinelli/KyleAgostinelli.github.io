import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

const projects = [
  {
    name: 'DxId / Layer0 Blockchain',
    stage: 'Architecture + Early Build',
    summary:
      'A web3 infrastructure concept centered on identity-aware interoperability at the Layer0 level.',
    details: [
      'Focuses on cross-chain identity context and trust-aware routing.',
      'Designed to support modular systems that can integrate with future app chains.',
      'Built as a foundational protocol experiment for long-term ecosystem tooling.',
    ],
  },
  {
    name: 'Longyield L1 Blockchain',
    stage: 'Protocol Design',
    summary:
      'An L1 concept with long-horizon economic alignment, aimed at sustainable rewards and network stability.',
    details: [
      'Explores staking and yield mechanics for long-term participant incentives.',
      'Emphasizes predictable validator economics and scalable transaction patterns.',
      'Positioned as a research-forward project with room for iterative development.',
    ],
  },
]

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow="Projects"
      title="Selected Work"
      description="Current development work focused on blockchain architecture and protocol-level thinking."
    >
      <div className="grid gap-6">
        {projects.map((project, index) => (
          <article
            key={project.name}
            className="panel animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-2xl font-semibold text-white">{project.name}</h2>
              <span className="chip">{project.stage}</span>
            </div>
            <p className="max-w-3xl text-slate-300">{project.summary}</p>
            <ul className="mt-4 space-y-2 text-slate-200">
              {project.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="panel subtle mt-8 animate-fade-up [animation-delay:220ms]">
        <h2 className="font-heading text-2xl text-white">Want deeper technical details?</h2>
        <p className="mt-2 max-w-2xl text-slate-300">
          I can walk through architecture decisions, design assumptions, and where each project is headed next.
        </p>
        <Link to="/contact" className="btn-secondary mt-6 inline-flex">
          Contact for Project Discussion
        </Link>
      </div>
    </PageShell>
  )
}
