# Security policy

This is a personal portfolio site, not a production service handling sensitive
data. That said, it does run real server-side code (route handlers, a
contact-form server action, rate limiting), so a real vulnerability here is
worth reporting properly rather than filing as a public GitHub issue.

## Reporting a vulnerability

Email **kyleagostinelli@protonmail.com** with a description of the issue and
steps to reproduce it. I'll acknowledge within a few days and let you know
once it's fixed. Please don't open a public issue for anything that could be
actively exploited before a fix ships (e.g., a way to bypass rate limiting to
send unbounded requests, or a way to make a route handler leak data it
shouldn't).

## Scope

In scope:

- The Next.js app in this repository (`app/`, `src/`).
- The API route handlers under `app/api/*` and the diagnostic tools under
  `app/tools/*`.
- The contact form and its server action.

Out of scope:

- Vercel's platform and infrastructure.
- Third-party services this site links to or depends on (Formspree, GitHub,
  npm registry, etc.) — report those upstream.
- Denial-of-service testing against the live deployment. The rate limiter is
  in-memory and per-instance by design (see `src/lib/rate-limit.ts`); if
  you've found a way around it, describe it by email instead of demonstrating
  it against the production URL.

## Known, accepted limitations

These are documented trade-offs, not open reports:

- Rate limiting is per-instance in-memory, not coordinated across Vercel
  instances or regions.
- The JWT decoder never sends tokens to a server (by design — see
  `src/lib/jwt/decode.ts`), so it has no server-side attack surface at all.
- The HAR analyzer strips `Authorization`, `Cookie`, and `Set-Cookie` values
  before they're rendered or logged.
