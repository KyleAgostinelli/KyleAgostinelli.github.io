export default function PageShell({ eyebrow, title, description, children }) {
  return (
    <section className="py-6 sm:py-10">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr,260px] lg:items-start">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 inline-flex rounded-sm border border-blue-400/30 bg-blue-500/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-blue-200">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="font-heading text-4xl font-semibold leading-tight text-neutral-50 sm:text-5xl">
            {title}
          </h1>
          {description ? <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-300">{description}</p> : null}
        </div>

        <aside className="margin-note hidden p-4 lg:block">
          <div className="mb-3 flex items-center gap-2">
            <span className="status-dot" />
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-teal-200">Available Signal</p>
          </div>
          <p className="text-sm leading-relaxed text-neutral-300">
            TSE-focused support specialist with SaaS, API, cloud systems, and customer-facing troubleshooting
            experience.
          </p>
        </aside>
      </div>
      <div className="section-rule mb-8" />
      <div>{children}</div>
    </section>
  )
}
