import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'

const metrics = [
  { label: '95%+ CSAT', value: 'Samsara support quality benchmark' },
  { label: '<5% transfer', value: 'Escalations kept low at scale' },
  { label: '50 tickets/day', value: 'Handled high-volume SaaS support queues' },
  { label: '9x Most Helpful', value: 'Recognized for clarity and customer advocacy' },
]

const skillTags = [
  'API Support',
  'Cloud-Connected Systems',
  'Technical Troubleshooting',
  'Networking',
  'Zendesk / Salesforce',
  'O365 Administration',
]

export default function HomePage() {
  return (
    <PageShell
      eyebrow="Portfolio"
      title="Kyle Agostinelli"
      description="Technical Support Specialist focused on SaaS, APIs, and cloud-connected systems with a track record of high first-contact resolution and strong customer outcomes."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
        <article className="panel animate-fade-up">
          <p className="text-sm uppercase tracking-[0.18em] text-cyan-200">Technical Support Specialist</p>
          <p className="mt-4 max-w-2xl text-slate-300">
            I support fast-moving teams by diagnosing complex technical issues, translating root causes into clear
            customer communication, and improving support processes that scale. I have experience across SaaS
            platforms, cloud tooling, and networking-heavy environments.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {skillTags.map((tag) => (
              <span key={tag} className="chip">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href="/KyleAgostinelli-Resume.pdf" download>
              Download Resume
            </a>
            <Link className="btn-secondary" to="/contact">
              Contact Me
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href="https://github.com/KyleAgostinelli"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 transition hover:text-cyan-200"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kyle-agostinelli-075329237/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 transition hover:text-cyan-200"
            >
              LinkedIn
            </a>
          </div>
        </article>

        <aside className="panel subtle animate-fade-up [animation-delay:120ms]">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Snapshot</p>
          <div className="mt-4 space-y-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="font-heading text-xl text-white">{metric.label}</p>
                <p className="mt-1 text-sm text-slate-300">{metric.value}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
