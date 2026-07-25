# Architecture Decision Records

Five short ADRs covering the Phase 0 decisions. Format: Context / Decision / Consequences.

---

## ADR 1 — Next.js App Router over the Vite SPA

**Context.** The current site is a Vite 7 + React 19 + react-router-dom 7 SPA deployed as a
static bundle to GitHub Pages. It has no server surface — everything, including the fake
`portfolioApi.js`, runs in the browser. Phase 4 needs real route handlers (HAR parsing,
escalation formatting, rate-limited POST endpoints) that a static export cannot provide.

**Decision.** Migrate to Next.js 15 App Router, deployed to Vercel. Server components by
default; client components only at interaction leaves (see `docs/ARCHITECTURE.md`).

**Consequences.** Gains a real backend surface, server actions for progressive-enhancement
forms, and per-route metadata/streaming — the things that make Phase 4 a genuine
demonstration rather than a description. Costs: a new deploy target (Vercel, not GitHub
Pages), a build step that didn't exist before, and the framework surface area itself becomes
something a reviewer can judge. If the API routes in Phase 4 end up abandoned, this decision
should be revisited — a static export of Next.js with no server routes is framework-for-the-
logo and worse than staying on Vite.

---

## ADR 2 — TypeScript strict mode

**Context.** The current codebase is plain JS/JSX with no type checking. Zero test coverage
plus zero types means the only thing catching a mistake before a screening call is a human
reading the diff.

**Decision.** `strict: true`, plus `noUncheckedIndexedAccess`, `noImplicitOverride`, and
`exactOptionalPropertyTypes`. Zero `any`, zero `@ts-ignore`. Content and every trust boundary
(route input, env vars, external fetch responses) validated with Zod, with types derived via
`z.infer` rather than hand-written in parallel.

**Consequences.** Slower to write the first draft of any component — every prop, every piece
of content, every API shape has to be honest about what it actually is. In exchange, a
reviewer who clones the repo sees a strict build pass as evidence, not a claim. The cost
shows up mostly in the content layer: `src/content/*.ts` needs a schema before it needs data,
which is more upfront structure than the current plain-object `portfolio.js`.

---

## ADR 3 — Styling: Tailwind v4 tokens over bespoke CSS

**Context.** `src/index.css` is 1,253 lines of hand-written classes (`.hero-dossier`,
`.proof-row`, `.dossier-lede`) used interleaved with Tailwind utilities in the same JSX — two
competing styling systems with no shared token layer. Compounding that, `tailwind.config.js`
declares `Outfit` and `Manrope` as the heading/body fonts, but `index.css` actually loads
`Inter` and `Source Serif 4` — the configured fonts are never loaded at all.

**Decision.** Delete the bespoke class system entirely (not port it — Phase 1 ships unstyled-
but-clean Tailwind utilities as an interim state). Phase 2 replaces it with a token layer
defined in Tailwind v4's `@theme`: OKLCH colors, an 11-step neutral ramp, one accent color,
and a modular type scale, with fonts actually loaded via `next/font`. Hand-written CSS is
capped at 250 lines total — if the token layer needs more than that to express the design,
the token layer is wrong, not the cap.

**Consequences.** No more silently-broken font config, because `next/font` fails loudly if a
declared font isn't wired up. Every color pair has to be justified against the token ramp
rather than picked ad hoc, which is more constraint than the current `.hero-dossier`-style
free-form CSS. The 250-line cap means genuinely reusable patterns (a card, a tag) become
Tailwind `@apply`-based component classes or React components — not one-off classes named
after the section they happen to style.

---

## ADR 4 — Testing strategy

**Context.** The only test file in the repo is `tests/example.spec.js`, the untouched
Playwright scaffold demo that navigates to `playwright.dev` and checks its title. There is a
`playwright.yml` CI workflow that runs it, meaning CI is green while testing nothing about
this site. For a technical reviewer, this is worse than having no test file at all — it
demonstrates the difference between "there's a CI badge" and "the CI badge means something."

**Decision.** Layered testing, added as each thing is built rather than retrofitted at the
end: Vitest + Testing Library for content-schema validation, every Phase 4 parser/formatter,
and route-handler success/failure/rate-limit paths; Playwright for real end-to-end specs
(navigation, contact form, each tool's happy path, keyboard-only mobile menu, both color
schemes) replacing the deleted demo file; `@axe-core/playwright` on every route, failing the
build on serious/critical violations; Lighthouse CI with enforced, specific budgets rather
than "reasonably fast."

**Consequences.** Every Phase 4 tool ships with tests as a condition of being done, not as
follow-up work — this is called out explicitly in that phase. CI takes longer to write and to
run than the current single scaffold test, but a reviewer running `npm test` sees assertions
about *this* site's behavior, and a red build actually means something broke.

---

## ADR 5 — Vercel deploy path and the existing GitHub Pages workflow

**Context.** `.github/workflows/deploy.yml` currently builds the Vite app and deploys it to
GitHub Pages at `kyleagostinelli.github.io`, which is the URL already printed on Kyle's
resume. That workflow assumes a static `dist/` artifact; it has no equivalent for a Next.js
app with live server routes, and Next.js on GitHub Pages would mean a static export with
every server feature (the Phase 4 route handlers, server actions, `next/og`) disabled —
exactly the "framework for the logo" outcome ADR 1 warns against.

**Decision.** Deploy to Vercel as the primary target. Keep `deploy.yml` on disk but disabled
(renamed `deploy.yml.disabled`) through the migration — not deleted — until the Vercel
production domain is live and verified. Once verified, either delete the old workflow or
convert it to a redirect-only GitHub Pages build that forwards `kyleagostinelli.github.io` to
the new domain, so the URL already on the resume doesn't 404.

**Consequences.** Two deploy surfaces exist simultaneously during the migration window, which
is deliberate — it means the resume link keeps working right up until the new domain is
confirmed live, rather than there being a gap where neither deploy is authoritative. The
redirect-or-delete decision is deferred to Phase 6 on purpose: it depends on whether Kyle
updates the resume to the new domain or keeps `kyleagostinelli.github.io` as the canonical
link.
