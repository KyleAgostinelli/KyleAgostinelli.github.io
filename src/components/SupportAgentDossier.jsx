import { useMemo, useState } from 'react'
import { Braces, ChevronRight, Download, FileText, Maximize2, Minimize2, Play, ShieldCheck } from 'lucide-react'
import { contactInfo, metrics, projects, skillGroups, supportCase, timeline } from '../data/portfolio'
import { makePortfolioRequest, portfolioEndpoints } from '../lib/portfolioApi'

const docs = [
  {
    id: 'profile',
    label: 'Profile',
    path: '/api/profile',
    deck: 'Who I am as a support candidate.',
  },
  {
    id: 'skills',
    label: 'Skills',
    path: '/api/skills',
    deck: 'Technical areas I can discuss and support.',
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/api/projects',
    deck: 'Systems thinking and technical communication examples.',
  },
  {
    id: 'resume',
    label: 'Resume',
    path: '/api/resume',
    deck: 'Direct access to experience and proof points.',
  },
  {
    id: 'auth-case',
    label: 'Auth Case',
    path: '/api/cases/auth-failure',
    deck: 'A sample API/SaaS troubleshooting walkthrough.',
  },
]

const endpointMap = Object.fromEntries(portfolioEndpoints.map((endpoint) => [endpoint.path, endpoint]))

function statusTone(status) {
  if (status >= 200 && status < 300) return 'text-teal-300'
  if (status === 422) return 'text-rose-300'
  return 'text-rose-300'
}

function buildResult(method, path) {
  return makePortfolioRequest({ method, path })
}

function DocBody({ selectedDoc }) {
  if (selectedDoc.id === 'profile') {
    return (
      <>
        <p className="dossier-lede">
          A hands-on support agent for complex SaaS, API, and customer-facing technical issues. I focus on clear
          diagnosis, practical customer communication, and evidence-based escalation.
        </p>
        <div className="proof-row">
          {metrics.map((metric) => (
            <div key={metric.label} className="proof-stat">
              <span>{metric.label}</span>
              <p>{metric.value}</p>
            </div>
          ))}
        </div>
        <div className="note-columns">
          <div>
            <h4>Role Target</h4>
            <p>{contactInfo.targetRole}, API Support, or Support Specialist II paths with room to grow into TSE work.</p>
          </div>
          <div>
            <h4>Working Style</h4>
            <p>Reproduce, isolate, explain, document, and escalate with the details engineering can actually use.</p>
          </div>
        </div>
      </>
    )
  }

  if (selectedDoc.id === 'skills') {
    return (
      <>
        <p className="dossier-lede">
          The skill map combines customer-facing support judgment with enough technical fluency to work through API,
          auth, networking, cloud-connected systems, and tooling questions.
        </p>
        <div className="research-list">
          {skillGroups.map((group) => (
            <section key={group.label}>
              <h4>{group.label}</h4>
              <div className="tag-row">
                {group.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </section>
          ))}
        </div>
      </>
    )
  }

  if (selectedDoc.id === 'projects') {
    return (
      <>
        <p className="dossier-lede">
          These projects are framed as research notes because the interview value is the reasoning: assumptions,
          failure boundaries, tradeoffs, and how complex systems are explained.
        </p>
        <div className="research-list">
          {projects.map((project) => (
            <section key={project.name}>
              <h4>{project.name}</h4>
              <p>{project.summary}</p>
              <p>{project.supportAngle}</p>
            </section>
          ))}
        </div>
      </>
    )
  }

  if (selectedDoc.id === 'resume') {
    return (
      <>
        <p className="dossier-lede">
          The resume is directly available here, without requiring anyone to understand or use the developer console.
        </p>
        <a className="btn-primary w-fit" href={contactInfo.resume} download>
          <Download size={16} aria-hidden="true" />
          Download Resume
        </a>
        <div className="research-list mt-6">
          {timeline.slice(0, 4).map((item) => (
            <section key={`${item.company}-${item.period}`}>
              <h4>{item.role}</h4>
              <p>
                {item.company} - {item.period}
              </p>
            </section>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <p className="dossier-lede">{supportCase.summary}</p>
      <div className="note-columns">
        <div>
          <h4>Likely Root Cause</h4>
          <p>{supportCase.likelyRootCause}</p>
        </div>
        <div>
          <h4>Customer Summary</h4>
          <p>{supportCase.customerSummary}</p>
        </div>
      </div>
      <div className="research-list">
        <section>
          <h4>Evidence Collected</h4>
          <ul>
            {supportCase.evidence.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

export default function SupportAgentDossier() {
  const [selectedId, setSelectedId] = useState('profile')
  const [method, setMethod] = useState('GET')
  const [consoleWidth, setConsoleWidth] = useState(300)
  const selectedDoc = docs.find((doc) => doc.id === selectedId) || docs[0]
  const activeEndpoint = endpointMap[selectedDoc.path]
  const [result, setResult] = useState(() => buildResult('GET', docs[0].path))
  const responseJson = useMemo(() => JSON.stringify(result, null, 2), [result])
  const consoleStyle = { '--console-width': `${consoleWidth}px` }

  function selectDoc(doc) {
    setSelectedId(doc.id)
    setMethod('GET')
    setResult(buildResult('GET', doc.path))
  }

  function previewResponse(nextMethod = method, nextPath = selectedDoc.path) {
    setResult(buildResult(nextMethod, nextPath))
  }

  function probeNotFound() {
    setResult(buildResult('GET', '/api/not-in-dossier'))
  }

  function probeValidation() {
    setResult(buildResult('POST', selectedDoc.path))
  }

  return (
    <section className="dossier-module" style={consoleStyle} aria-label="Support agent dossier">
      <div className="dossier-header">
        <div>
          <p className="eyebrow">Support Agent Dossier</p>
          <h2>Readable first. Technical depth when wanted.</h2>
        </div>
        <span className={`status-pill ${statusTone(result.response.status)}`}>
          {result.response.status} {result.response.statusText}
        </span>
      </div>

      <div className="dossier-workspace">
        <nav className="dossier-nav" aria-label="Dossier sections">
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              className={doc.id === selectedId ? 'is-active' : ''}
              onClick={() => selectDoc(doc)}
            >
              <span>{doc.label}</span>
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          ))}
        </nav>

        <article className="dossier-document">
          <div className="document-kicker">
            <FileText size={16} aria-hidden="true" />
            <span>{activeEndpoint?.path}</span>
          </div>
          <h3>{selectedDoc.label}</h3>
          <p className="document-deck">{selectedDoc.deck}</p>
          <DocBody selectedDoc={selectedDoc} />
        </article>

        <aside className="developer-slate">
          <div className="developer-slate-top">
            <div>
              <p className="eyebrow">Developer Detail</p>
              <h3>Response Preview</h3>
            </div>
            <div className="console-resize">
              <button type="button" onClick={() => setConsoleWidth(260)} aria-label="Make console narrower">
                <Minimize2 size={14} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setConsoleWidth(430)} aria-label="Make console wider">
                <Maximize2 size={14} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="console-controls">
            <label>
              Method
              <select value={method} onChange={(event) => setMethod(event.target.value)}>
                <option>GET</option>
                <option>POST</option>
              </select>
            </label>
            <label>
              Path
              <input value={selectedDoc.path} readOnly />
            </label>
          </div>

          <div className="console-actions">
            <button type="button" className="btn-primary" onClick={() => previewResponse()}>
              <Play size={15} aria-hidden="true" />
              Preview Response
            </button>
            <button type="button" className="text-button" onClick={probeNotFound}>
              404
            </button>
            <button type="button" className="text-button" onClick={probeValidation}>
              422
            </button>
          </div>

          <div className="console-meta">
            <span>
              <ShieldCheck size={14} aria-hidden="true" />
              {result.response.latencyMs}ms
            </span>
            <span>{result.request.method}</span>
          </div>
          <pre className="developer-output">{responseJson}</pre>
        </aside>
      </div>

      <div className="dossier-footer-note">
        <Braces size={16} aria-hidden="true" />
        <span>
          The document view is for hiring managers and recruiters. The response preview is there for technical readers
          who want to inspect the underlying structure.
        </span>
      </div>
    </section>
  )
}
