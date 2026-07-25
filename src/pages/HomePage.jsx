import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Download,
  ExternalLink,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import SupportAgentDossier from '../components/SupportAgentDossier'
import { contactInfo, metrics, skillTags, supportCase } from '../data/portfolio'

const supportSignals = [
  'API auth and integration triage',
  'Clear customer-ready root cause summaries',
  'Escalations packaged with evidence and repro steps',
]

export default function HomePage() {
  return (
    <PageShell
      eyebrow="Support Engineering Dossier"
      title="Kyle Agostinelli"
      description="A personal diagnostic portfolio for TSE, Support Specialist II, API Support, and IT-adjacent roles. Built to show how I investigate, explain, and close technical issues."
    >
      <section className="hero-dossier">
        <div className="hero-copy">
          <div className="mb-4 inline-flex items-center gap-2 rounded-sm border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-blue-200">
            <span className="status-dot" />
            Candidate file open
          </div>
          <h2>A hands-on support agent for complex SaaS, API, and customer-facing technical issues.</h2>
          <p>
            I help users move from "something is broken" to a clear technical outcome: reproduce the issue, isolate
            the cause, communicate the fix, and package the right evidence when engineering needs to step in.
          </p>
          <div className="signal-list">
            {supportSignals.map((signal) => (
              <div key={signal}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
          <div className="tag-row mt-7">
            {skillTags.slice(0, 7).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="btn-primary" href={contactInfo.resume} download>
              <Download size={16} aria-hidden="true" />
              Download Resume
            </a>
            <Link className="btn-secondary" to="/contact">
              <Mail size={16} aria-hidden="true" />
              Job Opportunity
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={contactInfo.github} target="_blank" rel="noreferrer" className="icon-link">
              <Code2 size={14} aria-hidden="true" />
              GitHub
              <ExternalLink size={12} aria-hidden="true" />
            </a>
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="icon-link">
              <BriefcaseBusiness size={14} aria-hidden="true" />
              LinkedIn
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          </div>
        </div>

        <aside className="hero-portrait">
          <div>
            <img
              src={contactInfo.avatar}
              alt="Kyle Agostinelli"
              className="h-28 w-28 rounded-sm border border-white/15 object-cover"
            />
            <p>Technical Support Specialist</p>
            <span>{contactInfo.targetRole}</span>
          </div>
        </aside>
      </section>

      <div className="metric-strip">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.tone.toUpperCase().slice(0, 3)}</span>
            <h3>{metric.label}</h3>
            <p>{metric.value}</p>
          </article>
        ))}
      </div>

      <SupportAgentDossier />

      <section className="case-band">
        <article>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-teal-300" size={24} aria-hidden="true" />
            <div>
              <p className="eyebrow">Case Notes</p>
              <h2>{supportCase.title}</h2>
            </div>
          </div>
          <p>{supportCase.summary}</p>
          <Link to="/projects" className="btn-secondary mt-6 inline-flex">
            View Technical Work
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </article>

        <article>
          <div>
            <section>
              <h3>Likely Root Cause</h3>
              <p className="text-sm leading-6 text-neutral-300">{supportCase.likelyRootCause}</p>
            </section>
            <section>
              <h3>Escalation Package</h3>
              <p className="text-sm leading-6 text-neutral-300">{supportCase.escalationNotes}</p>
            </section>
            <section>
              <h3>Customer Summary</h3>
              <p className="text-sm leading-6 text-neutral-300">{supportCase.customerSummary}</p>
            </section>
          </div>
        </article>
      </section>
    </PageShell>
  )
}
