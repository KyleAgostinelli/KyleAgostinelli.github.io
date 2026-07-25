# Kyle Agostinelli Portfolio

Next.js 15 (App Router) + TypeScript (strict) + Tailwind v4 portfolio site, deployed to Vercel.

This is mid-migration from a previous Vite + React SPA. See `docs/ARCHITECTURE.md`,
`docs/DECISIONS.md`, and `docs/MIGRATION.md` for the rebuild plan. A full reviewer-facing
README rewrite is a later step in that plan.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Contact form

The contact page posts through a server action (`app/contact/actions.ts`). If
`FORMSPREE_ENDPOINT` is set, it forwards the submission there; otherwise it redirects to a
prefilled `mailto:` link. Copy `.env.example` to `.env.local` and set:

```bash
FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

## Deployment

The live site is on Vercel: https://kyleagostinelliportfolio.vercel.app/

`kyleagostinelli.github.io` (this repo's GitHub Pages site) is a static redirect only -
`gh-pages-redirect/index.html`, deployed by `.github/workflows/deploy.yml` - so the URL
already on Kyle's resume forwards to the real site instead of 404ing or serving a stale
build. It is not the app itself; GitHub Pages can't run this app's server-side pieces
(API routes, server actions, cookie-based theme) at all.
