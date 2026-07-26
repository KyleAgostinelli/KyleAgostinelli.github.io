import type { NextConfig } from 'next'

// Content-Security-Policy is set in middleware.ts instead - it needs a fresh nonce per
// request, which a static header list here can't generate.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Belt-and-braces alongside the CSP's frame-ancestors 'none' (middleware.ts) - some scanners
  // still check for this header specifically even though frame-ancestors supersedes it.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  headers() {
    return Promise.resolve([{ source: '/:path*', headers: securityHeaders }])
  },
}

export default nextConfig
