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

## npm audit: 8 more findings added by `@lhci/cli` (since Phase 5)

Installing `@lhci/cli` for Lighthouse CI (`lighthouserc.json`,
`.github/workflows/ci.yml`) pulled in `chrome-launcher`, `inquirer`, `tmp`, and `uuid` as
transitive dependencies, bringing `npm audit` from 12 findings to 20:

1. **`tmp` (via `chrome-launcher` and `inquirer` → `external-editor`)** - arbitrary temp
   file/directory write via a symlinked `dir` parameter, and a path-traversal via
   unsanitized prefix/postfix.
2. **`uuid`** - missing buffer bounds check in v3/v5/v6 when a buffer is provided.
3. **`chrome-launcher` → `rimraf` → `glob` → `minimatch` → `brace-expansion`** - the same
   `brace-expansion` DoS already tracked above, reached through a second dependency path.
4. **`inquirer`/`external-editor`** - low severity, inherited from the `tmp` finding above.

**Why not fixed.** All of these are internal to `@lhci/cli`'s own CLI machinery (its
interactive prompts and its Chrome-launching temp profile handling) - not something this
project's code calls into or can patch independently without `npm overrides` fighting
lhci's own dependency resolution, for a tool that only ever runs in CI/local dev.

**Actual exposure, as of this repo today:** `@lhci/cli` is a devDependency that runs exactly
once per CI run, against `localhost` URLs this repo itself serves, with no user-supplied
input of any kind (no prompts are answered interactively in CI, no attacker controls the
temp directory name or contents). None of it ships to a visitor's browser.

**Revisit:** re-run `npm audit` whenever `@lhci/cli` is bumped; a version pinning updated
`chrome-launcher`/`tmp`/`uuid` resolves this without any change on this project's side.

## Avatar is self-hosted but not displayed anywhere (since Phase 6)

`profile.avatar` now points at a self-hosted file (`public/avatar.png`, downloaded from the
real GitHub avatar) instead of hotlinking `avatars.githubusercontent.com`, closing the gap
Phase 6 flagged. It still isn't rendered anywhere in the UI, on purpose: the actual photo is
a distant, environmental shot (a person in a field), not a headshot, and cropping it into a
small square avatar produces a low-detail, illegible result - worse than showing nothing.

**Revisit:** if Kyle supplies an actual headshot, add it via `next/image` on the About page
(explicit dimensions, blur placeholder) at that point, rather than forcing today's source
photo into a frame it wasn't shot for.
