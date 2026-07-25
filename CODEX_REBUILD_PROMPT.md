# Codex Rebuild Prompt — kyleagostinelli.github.io

**How to use this file:** Paste `PHASE 0` into Codex first. Then paste each subsequent phase one at a time, reviewing and committing between phases. Do not paste the whole document at once — Codex silently drops requirements from long prompts, and you lose the review checkpoints that keep it honest.

Target stack: **Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4, deployed to Vercel.**

---

## PHASE 0 — Global brief (paste this first, and re-paste the "Standing rules" section at the top of every later phase)

```
You are working on my personal portfolio site. Read this brief fully before writing any code.

## Who I am and what this site is for

I am Kyle Agostinelli, a technical support specialist targeting Technical Support Engineer
(TSE) and Support Specialist II roles. My background:

- Technical Consultant, Gerson Lehrman Group (GLG), Jan 2024 – present
- Technical Support Specialist, Samsara, Feb 2023 – Mar 2024 (SaaS/API/fleet telematics)
- Technical Sales Specialist, Asurion, May 2021 – Feb 2023
- Technical Support Specialist, Cable One (Sparklight), May 2021 – Feb 2023
- IT Administrator, Calculated Fire Protection, Aug 2018 – Aug 2019
- A.S. Engineering, SUNY Orange County Community College, 4.0 GPA
- IBM/Coursera: HTML/CSS/JS + Cloud Computing

The audience for this site is a hiring manager or senior TSE who has 90 seconds, plus a
technical reviewer who may clone the repo and read the code. It has to work for both.

The site's job is to prove three things:
1. I can diagnose and communicate technical problems at an engineer's level of rigor.
2. I write real software, not template output.
3. I am a specific person with a specific way of thinking, not a resume in a grid.

## Standing rules — apply to every phase, no exceptions

**Code quality**
- TypeScript strict mode. `strict: true`, `noUncheckedIndexedAccess: true`,
  `noImplicitOverride: true`, `exactOptionalPropertyTypes: true`. Zero `any`. Zero
  `@ts-ignore`. If you need an escape hatch, use `unknown` plus a type guard and explain why
  in a comment.
- No dead code, no commented-out blocks, no `TODO` left behind. If something is
  intentionally deferred, put it in `docs/BACKLOG.md`, not in a comment.
- Every exported function and component gets a real signature. Discriminated unions over
  boolean flag soup. Parse, don't validate: use Zod at every trust boundary (route handler
  input, env vars, external fetch responses) and derive TS types from the schemas with
  `z.infer`, so there is exactly one source of truth.
- Prefer server components. Only add `"use client"` at the leaf that actually needs
  interactivity, and note in a one-line comment why that boundary is where it is.
- No `useEffect` for anything that isn't genuinely an external-system subscription. No state
  that can be derived. No prop drilling more than two levels.
- Error handling is explicit. Every route handler returns a typed result. Every async
  boundary has an `error.tsx`. Nothing swallows exceptions.
- Conventional Commits. Small, atomic commits with real messages. Not "update files."

**Anti-generic-AI-output rules — these matter as much as the code**

The current site reads as machine-generated and I need that fixed. Specifically, do NOT
produce any of the following:

- Gradient-text headings, glassmorphism cards, glowing purple/blue orbs, animated blobs,
  `backdrop-blur` on everything, or a dark-mode-only neon aesthetic.
- Hero copy in the pattern "I help X move from Y to Z." Any sentence built on
  "It's not just X, it's Y." Any use of: leverage, robust, seamless, cutting-edge,
  passionate, journey, elevate, unlock, empower, delve, tapestry, testament, landscape.
- Em-dash-heavy rhythm. Tricolons everywhere. Sentences that all run 15–20 words. Vary
  sentence length deliberately; some should be four words.
- Emoji anywhere in the UI or the codebase.
- Icon-plus-three-words feature grids with no substance behind them.
- Fake metrics, fake testimonials, fake client logos, or invented project outcomes.
- A "skills" section rendered as percentage bars or star ratings. Nobody is 87% at DNS.

Instead: restraint. One strong typographic idea, one accent color used sparingly, generous
whitespace, real content density where it earns attention. The site should look like a
careful person made deliberate choices — because that IS the signal for a support
engineering role.

**Honesty constraint (hard requirement)**

Every claim on this site must be defensible in an interview. If you are ever unsure whether
a fact is real, do not write it — instead put a `<!-- NEEDS_KYLE: question -->` marker in the
file and list it in `docs/NEEDS_KYLE.md`. Never invent a metric, a project outcome, a
technology I've used, or a quote. I would rather ship with a gap than get caught out in a
screening call.

## What exists today (read before changing anything)

Current repo: Vite 7 + React 19 + react-router-dom 7 + Tailwind 3, deployed to GitHub Pages
via `.github/workflows/deploy.yml`. Roughly 2,700 lines across `src/`.

Files:
- `src/main.jsx`, `src/App.jsx` — router setup, four routes
- `src/components/SiteLayout.jsx` (134 lines) — header, nav, footer
- `src/components/PageShell.jsx`, `src/components/AcademicBackdrop.jsx`
- `src/components/SupportAgentDossier.jsx` (303 lines) — the interactive "API console"
- `src/pages/{HomePage,ProjectsPage,AboutPage,ContactPage}.jsx`
- `src/data/portfolio.js` (144 lines) — all site content as plain exported objects
- `src/lib/portfolioApi.js` (151 lines) — a synchronous in-browser mock of an HTTP API
- `src/index.css` (1,253 lines) — hand-written CSS classes
- `tests/example.spec.js` — the untouched Playwright demo that navigates to playwright.dev

Known problems you must fix, not carry forward:

1. `tests/example.spec.js` is the default scaffold test hitting an external site. There is
   effectively zero test coverage. This is the single most damaging thing in the repo for a
   technical reviewer.
2. `tailwind.config.js` declares `Outfit`, `Manrope`, and `IBM Plex Mono` as font families,
   but `src/index.css` imports `Inter`, `IBM Plex Mono`, and `Source Serif 4`. The declared
   heading and body fonts are never actually loaded. Fonts are broken and nobody noticed.
3. `src/index.css` is 1,253 lines of bespoke class names (`.hero-dossier`, `.proof-row`,
   `.dossier-lede`) used alongside Tailwind utilities in the same JSX. Two competing styling
   systems, no design tokens, unmaintainable.
4. A stale `dist/` build directory sits in the working tree. It is correctly gitignored, but
   confirm it is untracked (`git ls-files dist` should return nothing) and delete it locally.
5. `src/lib/portfolioApi.js` presents itself as an API but is a synchronous function that
   fakes latency with `42 + path.length * 3`. A reviewer spots this in ten seconds and it
   undercuts the whole premise. This must become a real HTTP surface (see Phase 4).
6. No TypeScript, no unit tests, no accessibility testing, no performance budget, no error
   boundaries, no metadata/OG tags, no sitemap, no structured data.

## Content that must survive the rebuild

Preserve this factual content; you may restructure and rewrite the prose around it.

Contact: Kyle Agostinelli, Iowa City IA, kyleagostinelli@protonmail.com,
github.com/KyleAgostinelli, linkedin.com/in/kyle-agostinelli-075329237,
resume at `/KyleAgostinelli-Resume.pdf` (currently in `public/`).

Claimed proof points (all real, keep them, but present them with their context rather than
as floating stat-card numbers):
- 95%+ CSAT
- Transfer rate under 5%
- Up to 50 SaaS support tickets per day
- Recognized 9x as "Most Helpful"
- 97% first-contact resolution at Cable One
- Recovered $100K+ in project data as IT Administrator at Calculated Fire Protection

Skill areas: API support, SaaS troubleshooting, authentication and OAuth flows,
integrations, DNS/DHCP/VLANs/TCP-IP, Windows/macOS, Active Directory and Azure AD, O365
administration, Zendesk, Salesforce, ticket triage, process improvement, HTML/CSS/JS/React.

Projects (both are early-stage protocol design work — describe them honestly as concepts and
architecture exercises, never as shipped products):
- DxId / Layer0 — identity-aware cross-chain interoperability concept
- Longyield L1 — L1 design exploring long-horizon staking and validator economics

Worked case study to preserve and expand: API auth failure after token rotation. Webhook
delivery succeeds but subsequent API calls return 401; the refreshed credential was issued
without the scope the endpoint requires. Symptoms, evidence, root cause, troubleshooting
steps, escalation package, and customer-facing summary are all in
`src/data/portfolio.js` under `supportCase`.

## Deliverable for Phase 0 — planning only, no implementation

Do not write application code yet. Produce:

1. `docs/ARCHITECTURE.md` — proposed directory structure, the server/client component
   boundary map, data-layer design, and where types live.
2. `docs/DECISIONS.md` — five short ADRs (context / decision / consequences), one each for:
   Next.js App Router over Vite SPA; TypeScript strict; the styling strategy replacing
   1,253 lines of bespoke CSS; the testing strategy; the Vercel deploy path and what happens
   to the existing GitHub Pages workflow.
3. `docs/NEEDS_KYLE.md` — empty scaffold with a table: Question | Why it matters | Where it
   appears.
4. A migration plan listing which existing files are ported, which are rewritten, and which
   are deleted.

Then stop and wait for my review.
```

---

## PHASE 1 — Scaffold and migrate

```
[Re-paste "Standing rules" from Phase 0]

Implement the migration plan from docs/ARCHITECTURE.md.

1. Scaffold Next.js 15 App Router with TypeScript strict, ESLint (flat config,
   typescript-eslint strict + stylistic), and Prettier. Node 20+, npm.
2. Configure `tsconfig.json` with the strict flags from the standing rules, plus path
   aliases (`@/components`, `@/lib`, `@/content`).
3. Port `src/data/portfolio.js` to `src/content/*.ts` split by domain (profile, experience,
   skills, projects, cases). Define Zod schemas for each and export types via `z.infer`.
   Content objects must be validated at module load so a typo fails the build, not
   production.
4. Rebuild the four routes as App Router pages: `/`, `/work`, `/about`, `/contact`. Use a
   root layout with the header/footer from `SiteLayout.jsx`. Keep the mobile menu behavior
   but make it a client component isolated to itself, with proper focus trap, Escape to
   close, and `aria-expanded`.
5. Delete `src/index.css`'s bespoke class system entirely. Do not port it. Phase 2 builds
   the replacement — for now use plain Tailwind utilities so the site is functional and
   unstyled-but-clean.
6. Delete `tests/example.spec.js`. Delete the stale `dist/` directory from the working tree.
   Extend `.gitignore` with `.next/`, `out/`, `.vercel`, `.env*.local` (it already covers
   `dist` and `node_modules`).
7. Add `vercel.json` if needed, and a `.github/workflows/ci.yml` that runs typecheck, lint,
   and build on every PR. Keep the old `deploy.yml` on disk but disabled (rename to
   `deploy.yml.disabled`) until the Vercel domain is confirmed live — do not delete it.
8. Every page must render with zero TypeScript errors, zero lint warnings, and a successful
   `next build`. Run all three and paste the output.

Report: files created, files deleted, and anything from the plan you could not do and why.
```

---

## PHASE 2 — Design system

```
[Re-paste "Standing rules" from Phase 0]

Replace the deleted CSS with a real design system. This phase decides whether the site looks
authored or generated, so bias toward restraint over effects.

1. Token layer. Define CSS custom properties in `@theme` (Tailwind v4) for color, spacing,
   radius, shadow, and a type scale. Colors are defined in OKLCH. Neutrals are a real ramp
   (11 steps), not `gray-400` guesses. One accent color, used for interactive states and
   almost nothing else.
2. Typography. Pick two families maximum and actually load them with `next/font` — the
   current config declares fonts it never loads, do not repeat that. Establish a modular
   scale, set optical sizing where the family supports it, cap measure at ~68 characters for
   body copy, and set `text-wrap: balance` on headings / `pretty` on paragraphs. Type is the
   primary design element here.
3. Light and dark. Both must be first-class and both must be genuinely legible — dark is not
   just inverted. Respect `prefers-color-scheme` with a manual toggle that persists via
   cookie so there is no flash on first paint (server-read, not a client-side flicker fix).
4. Contrast. Every text/background pair meets WCAG AA (4.5:1 body, 3:1 large). Verify
   programmatically and include the check in the test suite, not by eyeballing it.
5. Motion. Small and purposeful: view transitions between routes, a subtle
   scroll-linked progress indicator, staggered reveal on first paint only. Everything wrapped
   in `prefers-reduced-motion: reduce` guards that fully disable — not "reduce" — animation.
   No parallax. No animated backgrounds. No mouse-follow effects.
6. Layout. Use CSS Grid with named areas for the page shell, container queries for components
   that need to adapt to their slot rather than the viewport, and logical properties
   throughout (`padding-inline`, `margin-block`).
7. Focus states. Visible, high-contrast, `:focus-visible`-based, never removed. A skip link
   to `#content` that is actually reachable.

Constraint: no more than 250 lines of hand-written CSS total. If you need more than that,
the token layer is wrong.

Show me the token file and one representative component before styling the whole site.
```

---

## PHASE 3 — Content and voice

```
[Re-paste "Standing rules" from Phase 0]

This phase is about writing, not code. The current copy is competent AI filler and it is the
clearest tell that a machine made the site.

1. Rewrite every page's prose. Kill the "Support Engineering Dossier" / "Candidate file open"
   / "Field Record" framing — the classified-file metaphor is a costume, and it's doing the
   work that real specificity should be doing. Replace it with plain, confident, specific
   language.
2. The homepage above the fold must answer, in under 40 words: who I am, what I do, what I'm
   looking for. No metaphor, no throat-clearing, no "I help users move from X to Y."
3. Build a real case-study page at `/work/token-rotation-401` from the auth-failure case in
   the existing data. Structure it as an incident writeup an engineer would respect:
   context and stakes, what the customer reported, what I checked first and why, what I ruled
   out, the actual root cause, how I explained it to the customer (include the real
   customer-facing message), what I handed engineering, and what I'd do differently. Show the
   reasoning, including the wrong turn. Perfect narratives read as fiction.
4. Add a `/notes` section: MDX-based, typed frontmatter validated with Zod, syntax
   highlighting via Shiki at build time (no client-side highlighter). Scaffold the route and
   ship it with the case study plus a stub index. I will write the posts.
5. Every section needs a reason to exist. If a section is just "here are some words about
   me," delete it.
6. Where you need content only I can supply — actual anecdotes, opinions about support
   tooling, why I left a role, what I think most support orgs get wrong — do not invent it.
   Write `<!-- NEEDS_KYLE: ... -->` and log it in `docs/NEEDS_KYLE.md` with a specific
   question I can answer in two sentences.

Voice target: direct, technically precise, occasionally dry. Short sentences carry weight.
No hedging, no self-deprecation, no hype. Read every sentence back and ask "would a person
say this out loud." Delete it if not.
```

---

## PHASE 4 — TSE diagnostic tools (the differentiator)

```
[Re-paste "Standing rules" from Phase 0]

The current `src/lib/portfolioApi.js` fakes an API in the browser with synthetic latency
(`42 + path.length * 3`). Replace it with real server-side route handlers. This is the phase
that makes the site a demonstration of support engineering rather than a description of it.

Build these as genuine Next.js route handlers under `app/api/`, each with Zod-validated
input, typed responses, real HTTP status codes, structured error bodies with a stable error
code, and rate limiting.

1. `/api/http/:status` — returns a real response for any status code, with an explanation of
   what it means, common causes, and what a support engineer checks first. Front it with a UI
   at `/tools/status` where a user can fire real requests and inspect actual response headers.
2. `/api/har/analyze` (POST) — accepts a pasted HAR file or raw request/response pair,
   parses it, and surfaces the things that actually matter in support triage: failed
   requests, auth headers present/absent/malformed, CORS preflight failures, redirect chains,
   slow waterfalls, mixed content. Parsing runs server-side; the client never sees a
   half-implemented parser. Strip and never log any Authorization, Cookie, or Set-Cookie
   values, and say so in the UI.
3. `/api/jwt/decode` (POST) — decodes a JWT client-side only (never send tokens to the
   server; implement this one as a pure client module and say explicitly in the UI that the
   token never leaves the browser), showing header, claims, expiry math, and scope. This is
   directly tied to the token-rotation case study — link them.
4. `/api/escalation` (POST) — takes structured incident fields and produces a properly
   formatted escalation writeup: impact, scope, repro steps, request IDs, timestamp window,
   what's been ruled out, and the ask. This is my actual escalation format, made executable.
5. A DNS/connectivity explainer at `/tools/dns` that walks a lookup path
   (resolver → root → TLD → authoritative → A/CNAME → TLS → HTTP) with real explanations of
   where each step fails and what the symptom looks like to a customer.

Requirements for all of the above:
- Every tool works without JavaScript where physically possible (progressive enhancement via
  server actions and real `<form>` elements). A tool that dies without JS is not a
  demonstration of engineering judgment.
- Full keyboard operability. Results announced via `aria-live`.
- Rate limiting on every POST route, with a real 429 response and `Retry-After`.
- Input size caps, and a clear error when exceeded — do not let someone POST a 40MB HAR.
- No secrets in client bundles. Validate `process.env` with Zod at startup and fail loudly.
- Each tool page includes a short "why a support engineer cares about this" note. The tools
  are the argument; the notes are the citation.

Write unit tests for every parser and formatter as you build it, not after.
```

---

## PHASE 5 — Testing, CI, and observability

```
[Re-paste "Standing rules" from Phase 0]

1. Vitest + Testing Library. Meaningful coverage on: content schema validation, every parser
   and formatter from Phase 4, every route handler (success, validation failure, rate limit),
   and the theme toggle. Test behavior, not implementation details. Do not write assertions
   that only restate the code.
2. Playwright: real end-to-end specs replacing the deleted demo file. Cover the primary
   navigation path, the contact form (success and validation failure), each diagnostic tool's
   happy path, keyboard-only navigation of the mobile menu, and both color schemes.
3. `@axe-core/playwright` accessibility assertions on every route, failing the build on any
   serious or critical violation.
4. Lighthouse CI with enforced budgets: Performance ≥ 98, Accessibility 100, Best Practices
   100, SEO 100, CLS < 0.01, LCP < 1.2s on simulated 4G. The build fails if a budget is
   missed. Commit `lighthouserc.json`.
5. Bundle size budget enforced in CI. Fail on regression.
6. `.github/workflows/ci.yml`: typecheck → lint → unit → build → e2e → axe → lighthouse.
   Cache aggressively. Must finish in under five minutes.
7. Dependabot or Renovate config. A `SECURITY.md`. A real `LICENSE`.
8. Rewrite `README.md` for a technical reviewer: what this is, the stack and why, how to run
   it, how it's tested, how it deploys, and a short "notable implementation details" section
   pointing at the three or four things you're proudest of. Include the architecture diagram
   from Phase 0 as a Mermaid block. Assume the reader is deciding whether to interview me.

Paste the full CI output when green.
```

---

## PHASE 6 — Performance, SEO, and deployment

```
[Re-paste "Standing rules" from Phase 0]

1. Metadata API on every route: title templates, descriptions, canonical URLs, OpenGraph,
   Twitter cards. Dynamic OG images via `next/og` — generated, not static PNGs.
2. JSON-LD structured data: `Person` on the homepage, `BreadcrumbList` on nested routes,
   `TechArticle` on the case study and notes. Validate against schema.org.
3. `sitemap.ts`, `robots.ts`, `manifest.ts`, and a full favicon set generated from a real
   mark, not a default icon.
4. Font loading with `next/font`, `font-display: swap`, subset to Latin, preloaded. Zero
   layout shift from fonts.
5. All images through `next/image` with explicit dimensions, AVIF/WebP, and blur
   placeholders. The GitHub avatar currently hotlinked from
   `avatars.githubusercontent.com` should be self-hosted.
6. Streaming with Suspense where it earns anything. `loading.tsx` skeletons that match final
   layout dimensions exactly so nothing shifts.
7. Security headers in `next.config.ts`: a strict CSP with nonces (no
   `unsafe-inline`), HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
   `Permissions-Policy`. Verify against securityheaders.com and target an A+.
8. Contact form: keep Formspree as the transport if `FORMSPREE_ENDPOINT` is set, but route it
   through a server action with server-side Zod validation, a honeypot field, and a
   time-to-submit check. Fall back to a `mailto:` link only if the env var is absent, and make
   that fallback state obvious in the UI rather than silent.
9. Deploy to Vercel. Configure the production domain. Once the Vercel deployment is verified
   live, update `deploy.yml.disabled` — either delete it or convert it to a redirect-only
   GitHub Pages build that points at the new domain, so the old
   `kyleagostinelli.github.io` URL on my resume does not 404.

Final deliverable: the deployed URL, the Lighthouse report, the securityheaders.com grade,
and `docs/NEEDS_KYLE.md` with every open question you logged.
```

---

## PHASE 7 — Adversarial review

```
[Re-paste "Standing rules" from Phase 0]

Switch roles. You are now a senior technical support engineer with hiring authority who has
just been sent this portfolio. You are skeptical, you have limited time, and you have seen
forty AI-generated portfolios this month.

Review the deployed site and the repository and answer, bluntly:

1. What is the first thing that makes you suspect this was AI-generated? Be specific — quote
   the exact copy or name the exact file.
2. What claim on this site would you probe in a screening call, and would it survive?
3. Open five random source files. Does the code read as written by one person with a
   consistent point of view, or assembled? Cite examples.
4. Do the diagnostic tools actually demonstrate support engineering ability, or are they
   toys that look impressive in a screenshot?
5. What is missing that you would expect from someone targeting a TSE role?
6. If you had to reject this candidate based only on this site, what would your reason be?

Write the findings to `docs/REVIEW.md`. Then fix the top five issues. Do not soften the
review to make the fixes easier.
```

---

## Appendix A — What Codex cannot do for you

Codex can build the machine. It cannot supply the parts that actually differentiate you.
Answer these in your own words before Phase 3 and hand your answers to Codex as raw material.
Bad prose in your voice beats good prose in nobody's.

1. Describe one ticket you'll remember in ten years. What made it hard? What did you try that
   didn't work? What was the actual cause?
2. What do most support organizations get wrong? You've worked at Samsara, Cable One,
   Asurion, and GLG — you have a comparative view most candidates don't.
3. What's the difference between a support rep and a support engineer, in your experience of
   doing the first job and wanting the second?
4. Tell the $100K data recovery story at Calculated Fire Protection. What actually happened,
   step by step?
5. What's a technology you found genuinely interesting to troubleshoot, and why? Specificity
   here is the strongest anti-AI signal on the entire site.
6. What's your escalation format, verbatim? Paste a real one with the customer details
   removed. Phase 4's escalation tool should generate *your* format, not a generic one.
7. Why blockchain protocol design? A support candidate with L1 architecture side projects is
   unusual. The connection needs to be stated in your words or it reads as unfocused.

---

## Appendix B — Honest assessment of this plan

Read this before you start.

**The risk.** For a TSE role, hiring managers screen on troubleshooting ability, written
communication, and customer judgment — not React architecture. A portfolio with a strict-TS
Next.js build and 98 Lighthouse scores is not what gets you the interview. It is what
survives the interview once someone technical decides to look closely. Those are different
jobs, and this plan optimizes for the second one.

**What actually moves the needle** is Phase 3 and Phase 4: the case study written in your
voice, and diagnostic tools that demonstrate you think like an engineer. If you only have
time for part of this, do Phases 0, 1, 3, and 4, and skip the rest. A plain-looking site with
one excellent incident writeup beats a beautiful site with generic copy, every time.

**On the "high level developer" goal specifically.** Sophistication in code reads as
restraint, not complexity. A reviewer is impressed by clear boundaries, honest types, and
tests that would actually catch a regression. They are not impressed by clever abstractions,
and they are actively put off by complexity that isn't earning anything. The Phase 0 rules
are written to enforce this, but you should hold the line during review — if Codex proposes
something elaborate, ask what breaks if you delete it.

**On Next.js.** Moving to Vercel is what justifies it. On GitHub Pages, Next.js would be a
static export with every server feature disabled, and a technical reviewer reads that as
framework-for-the-logo. The API routes in Phase 4 are the reason this stack choice is
defensible. If you end up abandoning the real backend surface, drop back to Vite + strict
TypeScript rather than shipping a hollow Next.js app.

**One thing to keep.** The interactive API console in `SupportAgentDossier.jsx` is the best
idea in your current site. The execution is a fake — but the instinct, making your portfolio
queryable like a system, is genuinely good. Phase 4 is that instinct, done for real.
