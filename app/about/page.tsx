import type { Metadata } from 'next'
import { experience } from '@/content/experience'
import { skills } from '@/content/skills'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-14">
      <section>
        <h1 className="text-3xl font-semibold">Skills</h1>
        <div className="mt-6 flex flex-col gap-6">
          {skills.groups.map((group) => (
            <div key={group.label}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                {group.label}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700 dark:border-neutral-700 dark:text-neutral-300"
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
        <h2 id="outcomes-heading" className="text-3xl font-semibold">
          Outcomes
        </h2>
        <ul className="mt-6 flex flex-col gap-3">
          {experience.achievements.map((achievement) => (
            <li key={achievement} className="text-neutral-800 dark:text-neutral-200">
              {achievement}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="experience-heading">
        <h2 id="experience-heading" className="text-3xl font-semibold">
          Experience
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {experience.timeline.map((item) => (
            <div
              key={`${item.company}-${item.period}`}
              className="flex flex-col gap-1 border-b border-neutral-200 pb-4 sm:flex-row sm:items-baseline sm:justify-between dark:border-neutral-800"
            >
              <div>
                <h3 className="font-semibold">{item.role}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">{item.company}</p>
              </div>
              <p className="text-sm text-neutral-500">{item.period}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-heading">
        <h2 id="education-heading" className="text-3xl font-semibold">
          Education
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {experience.education.map((item) => (
            <div key={item.institution}>
              <h3 className="font-semibold">{item.institution}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{item.credential}</p>
              {item.detail ? <p className="text-sm text-neutral-500">{item.detail}</p> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
