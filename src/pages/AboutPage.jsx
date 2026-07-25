import { Award, BookOpen, Briefcase, CheckCircle2, Cpu, GraduationCap } from 'lucide-react'
import PageShell from '../components/PageShell'
import { achievements, skillGroups, timeline } from '../data/portfolio'

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Skill Matrix"
      title="Support Specialist With Practical Technical Depth"
      description="The through-line is simple: diagnose carefully, communicate clearly, and keep improving the system around the support queue."
    >
      <section className="about-dossier">
        <div className="skill-sheet">
          <div className="section-heading">
            <Cpu size={22} aria-hidden="true" />
            <div>
              <p className="eyebrow">01 / Technical Range</p>
              <h2>Core Skill Map</h2>
            </div>
          </div>

          <div className="skill-bands">
            {skillGroups.map((group) => (
              <section key={group.label} className="skill-band">
                <p className="field-label">{group.label}</p>
                <div className="tag-row">
                  {group.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="outcome-sheet">
          <div className="section-heading">
            <Award size={22} aria-hidden="true" />
            <div>
              <p className="eyebrow">02 / Support Proof</p>
              <h2>Selected Outcomes</h2>
            </div>
          </div>

          <ul className="outcome-list">
            {achievements.map((achievement) => (
              <li key={achievement}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="timeline-dossier">
        <div className="section-heading">
          <Briefcase size={22} aria-hidden="true" />
          <div>
            <p className="eyebrow">03 / Field Record</p>
            <h2>Experience Timeline</h2>
          </div>
        </div>

        <div>
          {timeline.map((item) => (
            <article key={`${item.company}-${item.period}`} className="timeline-row">
              <p>{item.period}</p>
              <div>
                <h3>{item.role}</h3>
                <span>{item.company}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="education-grid">
        <div className="education-note">
          <div className="section-heading">
            <GraduationCap size={22} aria-hidden="true" />
            <div>
              <p className="eyebrow">04 / Study</p>
              <h2>Education + Certification</h2>
            </div>
          </div>
          <div className="education-lines">
            <section>
              <h3>SUNY Orange County Community College</h3>
              <p>Associate of Science in Engineering</p>
              <p>4.0 GPA</p>
            </section>
            <section>
              <h3>IBM (Coursera)</h3>
              <p>HTML, CSS and JavaScript + Cloud Computing</p>
            </section>
          </div>
        </div>

        <aside className="interview-note">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen size={17} aria-hidden="true" />
            <p className="field-label mb-0">Interview Talking Point</p>
          </div>
          <p>
            This site itself can be discussed as a React, Tailwind, routing, form handling, and static-hosted UX
            project built around support engineering credibility.
          </p>
          <a className="btn-secondary mt-5 inline-flex" href="/KyleAgostinelli-Resume.pdf" download>
            View / Download Resume
          </a>
        </aside>
      </section>
    </PageShell>
  )
}
