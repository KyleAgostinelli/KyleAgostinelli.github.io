import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Per-request nonce for script-src, following Next.js's documented CSP pattern
// (https://nextjs.org/docs/app/guides/content-security-policy). Next.js reads the nonce off
// this request header and applies it to its own inline bootstrap/RSC scripts automatically -
// nothing in app/layout.tsx has to wire it manually.
//
// style-src allows 'unsafe-inline' as a deliberate, narrow exception: rehype-pretty-code
// (Shiki) colors syntax-highlighted tokens via inline `style` attributes on <span>s, which is
// how it works everywhere, not a bug to route around. Every other directive stays strict.
//
// No `upgrade-insecure-requests`: Vercel serves production over HTTPS already (HSTS above
// covers the same real-world guarantee), and the directive actively breaks local dev/test -
// WebKit, unlike Chromium and Firefox, doesn't exempt localhost from the upgrade and tries
// to reach https://localhost, which fails outright since the dev server has no TLS listener.
function buildCsp(nonce: string): string {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data:`,
    `font-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ')
}

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    // Skip static assets and image-metadata routes - only real pages need a CSP + nonce.
    '/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|opengraph-image).*)',
  ],
}
