// In-memory token bucket, keyed by client IP. Deliberately simple: this holds a limit per
// warm serverless instance only - it does not coordinate across concurrent cold starts or
// multiple instances. Acceptable for a portfolio site's traffic profile; an upgrade path
// (Upstash Redis, Vercel KV) belongs in docs/BACKLOG.md if traffic ever justifies it, not
// implemented speculatively now.

interface Bucket {
  count: number
  windowStart: number
}

interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

const buckets = new Map<string, Bucket>()

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (bucket.count < maxRequests) {
    bucket.count += 1
    return { allowed: true, retryAfterSeconds: 0 }
  }

  const retryAfterSeconds = Math.ceil((bucket.windowStart + windowMs - now) / 1000)
  return { allowed: false, retryAfterSeconds }
}

export function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const firstEntry = forwardedFor?.split(',')[0]?.trim()
  return firstEntry && firstEntry.length > 0 ? firstEntry : 'unknown'
}
