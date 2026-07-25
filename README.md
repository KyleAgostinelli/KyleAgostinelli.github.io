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

The production target is Vercel. The previous GitHub Pages workflow
(`.github/workflows/deploy.yml.disabled`) is kept on disk, disabled, until the Vercel domain
is verified live.
