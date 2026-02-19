import PageShell from '../components/PageShell'

const skills = [
  'API Support',
  'Product Support',
  'Software Support',
  'DNS / DHCP / VLANs / TCP/IP',
  'Windows / macOS',
  'Active Directory / Azure AD',
  'O365 Administration',
  'Zendesk / Salesforce',
  'HTML / CSS / JavaScript',
  'Troubleshooting + Process Improvement',
]

const achievements = [
  'Handled up to 50 SaaS support tickets per day while resolving API, authentication, and integration issues.',
  'Maintained 95%+ CSAT with a transfer rate under 5% in a high-growth support environment.',
  'Recognized 9 times as "Most Helpful" for technical clarity and customer advocacy.',
  'Resolved 97% of tickets on first contact at Cable One and advanced into business support cases.',
  'Recovered $100K+ in critical project data while serving as IT Administrator at Calculated Fire Protection.',
]

const timeline = [
  {
    role: 'Technical Consultant',
    company: 'Gerson Lehrman Group (GLG)',
    period: 'Jan 2024 - Present',
  },
  {
    role: 'Technical Support Specialist',
    company: 'Samsara',
    period: 'Feb 2023 - Mar 2024',
  },
  {
    role: 'Technical Sales Specialist',
    company: 'Asurion',
    period: 'May 2021 - Feb 2023',
  },
  {
    role: 'Technical Support Specialist',
    company: 'Cable One (Sparklight)',
    period: 'May 2021 - Feb 2023',
  },
  {
    role: 'IT Administrator',
    company: 'Calculated Fire Protection',
    period: 'Aug 2018 - Aug 2019',
  },
]

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Support Specialist With An Engineering Mindset"
      description="I specialize in turning hard technical problems into clear outcomes for users, teams, and products."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel animate-fade-up">
          <h2 className="font-heading text-2xl font-semibold text-white">Core Skills</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className="panel animate-fade-up [animation-delay:110ms]">
          <h2 className="font-heading text-2xl font-semibold text-white">Selected Achievements</h2>
          <ul className="mt-4 space-y-3 text-slate-200">
            {achievements.map((achievement) => (
              <li key={achievement} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-cyan-300" />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="panel animate-fade-up [animation-delay:180ms]">
          <h2 className="font-heading text-2xl font-semibold text-white">Experience Timeline</h2>
          <div className="mt-4 space-y-4">
            {timeline.map((item) => (
              <div key={`${item.company}-${item.period}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="font-medium text-cyan-200">{item.period}</p>
                <p className="mt-1 font-heading text-xl text-white">{item.role}</p>
                <p className="text-slate-300">{item.company}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel subtle animate-fade-up [animation-delay:260ms]">
          <h2 className="font-heading text-2xl font-semibold text-white">Education + Certification</h2>
          <div className="mt-4 space-y-4 text-slate-300">
            <div>
              <p className="font-medium text-white">SUNY Orange County Community College</p>
              <p>Associate of Science in Engineering</p>
              <p>4.0 GPA</p>
            </div>
            <div>
              <p className="font-medium text-white">IBM (Coursera)</p>
              <p>HTML, CSS and JavaScript + Cloud Computing</p>
            </div>
            <a className="btn-secondary mt-3 inline-flex" href="/KyleAgostinelli-Resume.pdf" download>
              View / Download Resume
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
