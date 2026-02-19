export default function PageShell({ eyebrow, title, description, children }) {
  return (
    <section className="animate-fade-up py-8 sm:py-12">
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
