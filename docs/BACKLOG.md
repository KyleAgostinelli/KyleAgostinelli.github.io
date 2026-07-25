# Backlog

Work that's intentionally deferred, per the standing rule that deferred items belong in
this file, not in a code comment or a commit message that gets buried once the branch
merges.

## npm audit: 12 high-severity findings, not actioned (since Phase 1)

`npm audit` reports 12 high-severity advisories. All three root causes are transitive -
none are a direct dependency of this project:

1. **`postcss` <=8.5.17** - bundled inside `next@15.5.21`'s own `node_modules/next/node_modules/postcss`.
   XSS via unescaped `</style>` in stringify output, arbitrary file read and path traversal
   via attacker-controlled `sourceMappingURL` in CSS comments.
   (GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849)
2. **`sharp` <0.35.0** - also bundled inside `next`'s dependency tree, used internally for
   `next/image` optimization. Inherited libvips vulnerabilities.
   (CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591; GHSA-f88m-g3jw-g9cj)
3. **`brace-expansion` <=5.0.7** - reached via `minimatch` → `@eslint/config-array` →
   `eslint` → `eslint-config-next`. DoS via unbounded expansion length.
   (GHSA-mh99-v99m-4gvg)

**Why not fixed.** `npm audit fix --force` resolves all twelve by downgrading `next` to
`9.3.3` - a version that predates the App Router, Server Actions, and everything this
rebuild is built on (see `docs/DECISIONS.md` ADR 1). That "fix" is strictly worse than the
finding: it reverts the entire migration. Neither `postcss`/`sharp` (inside `next`) nor
`brace-expansion` (inside `eslint-config-next`) can be pinned to a patched version from this
project's `package.json` without `npm overrides`, which would fight the framework's own
dependency resolution for no real gain here (see exposure, below).

**Actual exposure, as of this repo today:**

- `postcss` and `brace-expansion` are build-time / lint-time tooling. Neither ships in the
  production bundle a site visitor's browser executes.
- `sharp` runs server-side only, during `next/image` optimization of images this project
  supplies itself (the resume PDF's thumbnail, the self-hosted avatar once Phase 6 lands).
  Nothing today lets a site visitor control what `sharp` processes.

**When this stops being acceptable:** the day this site accepts user-supplied image content
server-side, `sharp`'s exposure changes from "processes our own assets" to "processes
attacker-controlled input," and this needs to be revisited before shipping that feature -
not after. The Phase 4 HAR-upload tool is the first feature that accepts arbitrary
user-supplied content at all (a pasted HAR file, JSON not an image), so it's the next
checkpoint to re-run `npm audit` against, not a trigger for this specific finding.

**Revisit:** re-run `npm audit` after any Next.js patch release. If Next bumps its internal
`postcss`/`sharp` versions, or `eslint-config-next` bumps past the vulnerable `eslint`
range, this resolves itself with a routine `npm update` and this entry gets deleted.
