# Architecture — Next.js rebuild

Status: proposed, not yet implemented (Phase 0 planning output). Nothing under `app/` or
`src/` described here exists yet; this is the target shape Phase 1 builds toward.

## Prerequisite: this repo has no git history

`ls -la` in the project root shows no `.git` directory — this is not a git repository today,
despite having GitHub Actions workflows checked in. The standing rules call for Conventional
Commits and small atomic commits, which need somewhere to land. Before Phase 1 writes any
code:

1. `git init`, add a baseline commit of the current Vite app as-is (`chore: snapshot
   pre-migration Vite app`) so the migration is a reviewable diff rather than a single
   opaque drop.
2. Create the GitHub remote (or confirm it already exists for
   `kyleagostinelli.github.io`) and push the baseline before starting the rewrite.

## Proposed directory structure

```
app/
├── layout.tsx                  # root layout: <html>, theme cookie read, header/footer
├── page.tsx                    # /
├── error.tsx                   # route-segment error boundary (root)
├── global-error.tsx            # top-level fallback for errors layout.tsx itself throws
├── not-found.tsx
├── loading.tsx                 # root skeleton, sized to match layout
├── work/
│   ├── page.tsx                 # /work — project + case study index
│   ├── loading.tsx
│   └── token-rotation-401/
│       └── page.tsx             # the auth-failure case study (Phase 3)
├── about/
│   └── page.tsx
├── contact/
│   ├── page.tsx
│   └── actions.ts               # server action: validate, honeypot, time-to-submit, send
├── notes/
│   ├── page.tsx                  # index, reads src/content/notes.ts
│   └── [slug]/
│       └── page.tsx              # renders one MDX post via next-mdx-remote/rsc
├── tools/
│   ├── status/
│   │   └── page.tsx              # UI for /api/http/:status
│   ├── har/
│   │   └── page.tsx              # UI for /api/har/analyze
│   ├── jwt/
│   │   └── page.tsx              # client-only JWT decoder, tied to the case study
│   ├── escalation/
│   │   └── page.tsx              # UI for /api/escalation
│   └── dns/
│       └── page.tsx              # DNS/connectivity walk-through, mostly static
├── api/
│   ├── http/
│   │   └── [status]/
│   │       └── route.ts
│   ├── har/
│   │   └── analyze/
│   │       └── route.ts
│   └── escalation/
│       └── route.ts
├── sitemap.ts
├── robots.ts
├── manifest.ts
└── opengraph-image.tsx          # or per-route og image generators

src/
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx        # server component
│   │   ├── MobileNav.tsx         # "use client" — see boundary map
│   │   ├── ThemeToggle.tsx       # server component, form + server action, no client JS
│   │   └── SiteFooter.tsx        # server component
│   ├── ui/                       # design-system primitives (Button, Tag, Callout, Card…)
│   └── tools/
│       ├── JwtDecoder.tsx         # "use client" — token must never leave the browser
│       ├── HarResultView.tsx      # server component; optional client filter leaf below it
│       ├── HarFilterControls.tsx  # "use client" — sort/filter of already-rendered results
│       └── StatusExplorer.tsx     # "use client" — reads real fetch() response headers
├── content/
│   ├── schema.ts                  # shared Zod primitives (DateRange, Metric, Signal…)
│   ├── profile.ts
│   ├── experience.ts
│   ├── skills.ts
│   ├── projects.ts
│   ├── cases.ts                    # the token-rotation case, structured
│   ├── notes.ts                    # frontmatter index over src/notes/*.mdx
│   └── tools/
│       ├── http-status.ts          # status code → meaning/causes/checks, shared by
│       │                           # app/api/http/[status]/route.ts and the /tools/status page
│       └── dns-steps.ts            # the resolver→root→TLD→…→HTTP step data
├── lib/
│   ├── env.ts                      # Zod-validated process.env, parsed once at import
│   ├── rate-limit.ts                # in-memory token bucket keyed by IP (see caveat below)
│   ├── har/
│   │   ├── parse.ts                 # HAR → typed findings (server-only)
│   │   └── parse.test.ts
│   ├── jwt/
│   │   ├── decode.ts                 # pure client-safe decode, no network calls
│   │   └── decode.test.ts
│   └── escalation/
│       ├── format.ts                 # structured fields → Kyle's escalation writeup
│       └── format.test.ts
└── notes/
    └── token-rotation-401-postmortem.mdx   # stub; Kyle writes the rest

tests/
├── unit/            # Vitest — content schemas, parsers, formatters, route handlers
└── e2e/             # Playwright — nav, forms, each tool's happy path, a11y, color schemes
```

## Server/client component boundary map

Default is server. The table below is the complete list of components that need
`"use client"`, and why each one earns it. Anything not listed stays a server component.

| Component | Reason for the client boundary |
|---|---|
| `MobileNav.tsx` | Needs open/close state, a focus trap, and an `Escape` key handler — genuine browser-event subscriptions, not derivable on the server. |
| `JwtDecoder.tsx` | Phase 4 requires the token never be sent to the server at all; decoding must run in the browser or the constraint is meaningless. |
| `StatusExplorer.tsx` | The tool's value is showing the *actual* response headers the browser received; that requires a real `fetch()` call from client JS, not a server-rendered proxy of it. A plain `<a href="/api/http/404">` link remains the no-JS fallback (opens the raw JSON response directly). |
| `HarFilterControls.tsx` | Sort/filter of an already-rendered result set is pure client-side UI state with no server round trip to justify — but it sits *beside* the server-rendered `HarResultView`, which does the actual parsing. |
| `ThemeToggle` interactive bits (if any survive review) | Only if the cookie-based server toggle turns out to need a same-frame visual flip; default plan below avoids this entirely. |
| Scroll progress indicator, first-paint stagger reveal | Small client leaves per Phase 2; both are inert without `prefers-reduced-motion` checked client-side, and both fully no-op under that media query. |
| `useFormStatus`-based submit buttons (contact form, escalation form) | The pending-spinner state is the only genuinely client-side sliver; the surrounding form is a server action and works with JS disabled. |

Notably **not** client components, despite being interactive-looking in the current site:
- `ThemeToggle` — implemented as a `<form action={toggleTheme}>` server action that flips a
  cookie and the layout re-renders server-side. No flash, no client JS required.
- The contact and escalation forms themselves — server actions with real `<form>` elements;
  only their submit-button pending state is a client leaf.
- `HarResultView` — parsing and rendering of findings is server-side; the client leaf only
  covers post-render filtering.

## Data-layer design

**Content modules** (`src/content/*.ts`): each file exports a Zod schema and a parsed
constant, e.g.:

```ts
export const profileSchema = z.object({ /* … */ })
export type Profile = z.infer<typeof profileSchema>
export const profile: Profile = profileSchema.parse({ /* literal data */ })
```

Parsing happens at module scope, so a typo in the literal data throws when the module is
first imported — which Next.js hits during `next build`, turning a content typo into a build
failure instead of a production bug. `src/content/schema.ts` holds primitives shared across
multiple content files (date ranges, metrics, signal tags) so there is one definition of
each shape.

**Notes/MDX**: posts live as `.mdx` files under `src/notes/`. Frontmatter is parsed and
validated against a Zod schema in `src/content/notes.ts` (title, slug, date, summary, tags),
so a malformed post fails the same way a malformed content object does. Syntax highlighting
runs at build time via Shiki (through `rehype-pretty-code` or equivalent) — no highlighter
ships to the client.

**Tool content**: the explanatory text each diagnostic tool shows ("what this status code
means," "what a support engineer checks first," the DNS step descriptions) lives in
`src/content/tools/*.ts` as typed data, imported by *both* the route handler (so the API
response includes the explanation) and the page component (so the static page can render the
same text without a network round trip). One source of truth, two consumers.

**Environment variables**: `src/lib/env.ts` defines a Zod schema over `process.env` and
parses it once at import time in a server-only module. Any route or server component that
needs an env var imports the parsed `env` object, never `process.env` directly. A missing or
malformed variable throws at startup, not silently at request time.

**Rate limiting**: `src/lib/rate-limit.ts` is an in-memory token bucket keyed by client IP
(from `x-forwarded-for` / Vercel's request geo headers). Caveat to carry into Phase 4: this
only holds a limit per warm serverless instance — it does not coordinate across concurrent
cold starts. That's an acceptable tradeoff for a portfolio site's traffic profile; the
upgrade path (Upstash Redis or Vercel KV) belongs in `docs/BACKLOG.md` if traffic ever
justifies it, not implemented speculatively now.

## Where types live

- **Anything backed by a Zod schema** (content, notes frontmatter, env, route handler
  input/output): the type is `z.infer<typeof schema>`, exported from the same file as the
  schema. There is exactly one definition; the type is derived, never hand-duplicated.
- **Parser-internal shapes with no external trust boundary** (e.g., the intermediate AST the
  HAR parser builds before producing findings): plain hand-written types co-located with the
  parser in `src/lib/har/parse.ts`, since there's no untrusted input to validate at that
  layer — the untrusted input (the raw HAR JSON) is validated once at the route handler.
- **Component prop types**: defined in the component's own file, not hoisted to a shared
  `types.ts` unless genuinely reused by more than one component.
- **Discriminated unions for tool results** (e.g., a HAR finding that's one of `auth-missing
  | cors-preflight-failure | redirect-chain | slow-waterfall | mixed-content`): live next to
  the parser that produces them in `src/lib/har/parse.ts`, re-exported for the UI components
  that switch on them.
