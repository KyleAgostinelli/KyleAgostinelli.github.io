import PageShell from '../components/PageShell'

const contactCards = [
  {
    label: 'Email',
    value: 'kyleagostinelli@protonmail.com',
    href: 'mailto:kyleagostinelli@protonmail.com',
  },
  {
    label: 'Phone',
    value: '(845) 702-1503',
    href: 'tel:+18457021503',
  },
  {
    label: 'Location',
    value: 'Iowa City, IA',
  },
]

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Let's Connect"
      description="Available for technical support, support engineering, and web3-adjacent collaboration conversations."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="panel animate-fade-up">
          <h2 className="font-heading text-2xl font-semibold text-white">Direct Contact</h2>
          <div className="mt-5 grid gap-3">
            {contactCards.map((card) => (
              <div key={card.label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">{card.label}</p>
                {card.href ? (
                  <a href={card.href} className="mt-2 inline-flex text-lg text-white transition hover:text-cyan-200">
                    {card.value}
                  </a>
                ) : (
                  <p className="mt-2 text-lg text-white">{card.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn-primary" href="mailto:kyleagostinelli@protonmail.com?subject=Portfolio%20Inquiry">
              Email Me
            </a>
            <a className="btn-secondary" href="/KyleAgostinelli-Resume.pdf" download>
              Download Resume
            </a>
          </div>
        </section>

        <aside className="panel subtle animate-fade-up [animation-delay:120ms]">
          <h2 className="font-heading text-2xl font-semibold text-white">Social Profiles</h2>
          <p className="mt-3 text-slate-300">Find my work history and projects on the platforms below.</p>
          <div className="mt-6 grid gap-3">
            <a
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white transition hover:border-cyan-300/60 hover:bg-cyan-500/10"
              href="https://github.com/KyleAgostinelli"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white transition hover:border-cyan-300/60 hover:bg-cyan-500/10"
              href="https://www.linkedin.com/in/kyle-agostinelli-075329237/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
