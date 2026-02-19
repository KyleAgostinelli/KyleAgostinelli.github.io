# Kyle Agostinelli Portfolio

React + Vite + Tailwind portfolio site for `KyleAgostinelli.github.io`.

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
