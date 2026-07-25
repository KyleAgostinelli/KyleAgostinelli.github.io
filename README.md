# Kyle Agostinelli Portfolio

React + Vite + Tailwind portfolio site for `KyleAgostinelli.github.io`.

## Contact form

The contact page uses a Formspree endpoint when configured. Copy `.env.example` to `.env.local` and set:

```bash
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

If the endpoint is not configured, the form falls back to a prefilled `mailto:` message.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

The workflow at `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

Required repository settings:

1. In GitHub, open `Settings -> Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` and wait for the `Deploy Portfolio` workflow to finish.
