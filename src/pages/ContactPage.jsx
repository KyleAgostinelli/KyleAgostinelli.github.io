import { useMemo, useState } from 'react'
import { BriefcaseBusiness, Code2, Download, Loader2, Mail, MapPin, Send } from 'lucide-react'
import PageShell from '../components/PageShell'
import { contactInfo } from '../data/portfolio'

const initialForm = {
  name: '',
  email: '',
  company: '',
  opportunityType: 'TSE / Support Engineer',
  message: '',
  website: '',
}

const opportunityTypes = [
  'TSE / Support Engineer',
  'Support Specialist II',
  'API Support',
  'IT Support',
  'Other technical opportunity',
]

function isConfiguredEndpoint(endpoint) {
  return Boolean(endpoint && !endpoint.includes('YOUR_FORM_ID'))
}

function buildMailto(form) {
  const subject = encodeURIComponent(`Portfolio opportunity from ${form.company || form.name || 'a recruiter'}`)
  const body = encodeURIComponent(
    [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Company: ${form.company || 'Not provided'}`,
      `Opportunity: ${form.opportunityType}`,
      '',
      form.message,
    ].join('\n'),
  )

  return `mailto:${contactInfo.email}?subject=${subject}&body=${body}`
}

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT
  const mailtoHref = useMemo(() => buildMailto(form), [form])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Use a valid email address.'
    if (!form.message.trim() || form.message.trim().length < 12) {
      nextErrors.message = 'Message should include at least a little context.'
    }
    return nextErrors
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (form.website) {
      setStatus('success')
      setStatusMessage('Thanks. Your message was queued.')
      return
    }

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
      setStatusMessage('Please fix the highlighted fields and try again.')
      return
    }

    if (!isConfiguredEndpoint(endpoint)) {
      window.location.href = mailtoHref
      setStatus('fallback')
      setStatusMessage('No Formspree endpoint is configured yet, so I opened a prefilled email instead.')
      return
    }

    setStatus('loading')
    setStatusMessage('Sending your message...')

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          opportunityType: form.opportunityType,
          message: form.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Form service rejected the request.')
      }

      setStatus('success')
      setStatusMessage('Message sent. Thanks for reaching out.')
      setForm(initialForm)
    } catch {
      setStatus('error')
      setStatusMessage('The form service did not respond. You can still use the email fallback below.')
    }
  }

  return (
    <PageShell
      eyebrow="Opportunity Intake"
      title="Send A Role, Project, Or Technical Conversation"
      description="Use the form for TSE, Support Specialist II, API Support, IT Support, or adjacent technical opportunities. If the form endpoint is not configured yet, it falls back to a prefilled email."
    >
      <div className="contact-dossier">
        <section className="contact-form-sheet">
          <div className="section-heading">
            <Mail size={22} aria-hidden="true" />
            <div>
              <p className="eyebrow">Recruiter Note</p>
              <h2>Opportunity Intake</h2>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(event) => updateField('website', event.target.value)}
              name="website"
              aria-hidden="true"
            />

            <div className="form-grid">
              <label>
                <span className="field-label">Name</span>
                <input
                  className="input-control"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  autoComplete="name"
                />
                {errors.name ? <span className="form-error">{errors.name}</span> : null}
              </label>

              <label>
                <span className="field-label">Email</span>
                <input
                  className="input-control"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  autoComplete="email"
                />
                {errors.email ? <span className="form-error">{errors.email}</span> : null}
              </label>
            </div>

            <div className="form-grid">
              <label>
                <span className="field-label">Company</span>
                <input
                  className="input-control"
                  value={form.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  autoComplete="organization"
                />
              </label>

              <label>
                <span className="field-label">Opportunity Type</span>
                <select
                  className="input-control"
                  value={form.opportunityType}
                  onChange={(event) => updateField('opportunityType', event.target.value)}
                >
                  {opportunityTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <span className="field-label">Message</span>
              <textarea
                className="textarea-control"
                value={form.message}
                onChange={(event) => updateField('message', event.target.value)}
                placeholder="Tell me about the role, team, product, support model, or interview next step."
              />
              {errors.message ? <span className="form-error">{errors.message}</span> : null}
            </label>

            <div className="contact-actions">
              <button className="btn-primary" type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <Send size={16} aria-hidden="true" />
                )}
                Send Message
              </button>
              <a className="btn-secondary" href={mailtoHref}>
                <Mail size={16} aria-hidden="true" />
                Email Fallback
              </a>
            </div>

            {statusMessage ? (
              <p className={`form-status ${status === 'error' ? 'is-error' : 'is-success'}`} role="status">
                {statusMessage}
              </p>
            ) : null}
          </form>
        </section>

        <aside className="contact-side">
          <section className="contact-memo">
            <p className="eyebrow">Direct Contact</p>
            <h2>Open Channels</h2>
            <div className="contact-links">
              <a className="icon-link justify-start" href={`mailto:${contactInfo.email}`}>
                <Mail size={15} aria-hidden="true" />
                {contactInfo.email}
              </a>
              <div className="contact-location">
                <MapPin size={17} aria-hidden="true" />
                <span>{contactInfo.location}</span>
              </div>
              <a className="btn-secondary" href={contactInfo.resume} download>
                <Download size={16} aria-hidden="true" />
                Download Resume
              </a>
            </div>
          </section>

          <section className="contact-memo is-muted">
            <p className="eyebrow">Profiles</p>
            <h2>Public Work</h2>
            <p>Find work history, technical projects, and public activity below.</p>
            <div className="contact-links mt-5">
              <a className="icon-link justify-start" href={contactInfo.github} target="_blank" rel="noreferrer">
                <Code2 size={15} aria-hidden="true" />
                GitHub
              </a>
              <a className="icon-link justify-start" href={contactInfo.linkedin} target="_blank" rel="noreferrer">
                <BriefcaseBusiness size={15} aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  )
}
