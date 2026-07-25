import { ArrowRight, Braces, GitBranch, Layers, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { projects, supportCase } from '../data/portfolio'

const caseColumns = [
  { label: 'Symptoms', items: supportCase.symptoms },
  { label: 'Evidence', items: supportCase.evidence },
  { label: 'Troubleshooting Steps', items: supportCase.troubleshootingSteps },
]

export default function ProjectsPage() {
  return (
    <PageShell
      eyebrow="Research Notes"
      title="Technical Work, Framed For Support Engineering"
      description="These projects show how I reason about systems, interfaces, failure states, and technical communication. The emphasis is not just what was built, but how I explain and support it."
    >
      <section className="project-ledger">
        {projects.map((project, index) => (
          <article key={project.name} className="project-entry">
            <div className="project-index">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{project.stage}</p>
            </div>

            <div className="project-main">
              <div className="project-title-row">
                <h2>{project.name}</h2>
                <span className="chip chip-success">
                  <GitBranch size={13} aria-hidden="true" />
                  Systems Thinking
                </span>
              </div>
              <p>{project.summary}</p>
              <p>{project.supportAngle}</p>
              <div className="tag-row mt-5">
                {project.signals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>

            <aside className="project-annotation">
              <div className="mb-4 flex items-center gap-2">
                <Layers size={17} aria-hidden="true" />
                <p className="field-label">Architecture Notes</p>
              </div>
              <ul>
                {project.details.map((detail) => (
                  <li key={detail}>
                    <Braces size={15} aria-hidden="true" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </article>
        ))}
      </section>

      <section className="case-ledger">
        <div className="case-ledger-header">
          <div>
            <p className="eyebrow">Case Notes: auth-failure</p>
            <h2>{supportCase.title}</h2>
          </div>
          <span className="chip chip-warning">{supportCase.severity}</span>
        </div>

        <p className="case-summary">{supportCase.summary}</p>

        <div className="case-grid">
          {caseColumns.map((column) => (
            <section key={column.label} className="case-note">
              <p className="field-label">{column.label}</p>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="resolution-strip">
          <section>
            <p className="field-label">Escalation Notes</p>
            <p>{supportCase.escalationNotes}</p>
          </section>
          <section>
            <p className="field-label">Customer-Ready Summary</p>
            <p>{supportCase.customerSummary}</p>
          </section>
        </div>

        <Link to="/contact" className="btn-primary mt-7 inline-flex">
          <MessageSquare size={16} aria-hidden="true" />
          Discuss A Role
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </PageShell>
  )
}
