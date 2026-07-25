import type { Metadata } from 'next'
import { experience } from '@/content/experience'
import { skills } from '@/content/skills'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-14">
      <div>
        <h1 className="reveal text-balance font-heading text-3xl font-semibold text-ink">About</h1>
        <p className="mt-4 max-w-(--measure) text-pretty text-ink">
          A support rep resolves the ticket in front of them. A support engineer works one level
          down: isolating the bug, securing the infrastructure behind it, understanding the system
          well enough to explain why it broke and how to keep it from breaking the same way twice.
          I&apos;ve spent my career doing the first job while building toward the second.
        </p>
        <p className="mt-4 max-w-(--measure) text-pretty text-ink">
          Most support orgs build strong, efficient teams, and then leave real capability on the
          table by not giving individual agents room to go beyond the ticket in front of them.
        </p>
      </div>

      <section>
        <h2 className="text-balance font-heading text-2xl font-semibold text-ink">Skills</h2>
        <div className="mt-6 flex flex-col gap-6">
          {skills.groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
                {group.label}
              </h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="outcomes-heading">
        <h2
          id="outcomes-heading"
          className="text-balance font-heading text-2xl font-semibold text-ink"
        >
          Outcomes
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {experience.achievements.map((achievement) => (
            <li key={achievement} className="max-w-(--measure) text-pretty text-ink">
              {achievement}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="experience-heading">
        <h2
          id="experience-heading"
          className="text-balance font-heading text-2xl font-semibold text-ink"
        >
          Experience
        </h2>
        <div className="mt-6 flex flex-col gap-5">
          {experience.timeline.map((item) => (
            <div key={`${item.company}-${item.period}`} className="border-b border-line pb-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="font-semibold text-ink">{item.role}</h3>
                  <p className="text-ink-muted">{item.company}</p>
                </div>
                <p className="text-sm text-ink-muted">{item.period}</p>
              </div>
              {item.detail ? (
                <p className="mt-3 max-w-(--measure) text-pretty text-sm text-ink-muted">
                  {item.detail}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-heading">
        <h2
          id="education-heading"
          className="text-balance font-heading text-2xl font-semibold text-ink"
        >
          Education
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {experience.education.map((item) => (
            <div key={item.institution}>
              <h3 className="font-semibold text-ink">{item.institution}</h3>
              <p className="text-ink-muted">{item.credential}</p>
              {item.detail ? <p className="text-sm text-ink-muted">{item.detail}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
