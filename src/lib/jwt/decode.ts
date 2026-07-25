// Pure client-side JWT decoding - no network calls, ever. A JWT's header and payload are
// arbitrary, provider-defined JSON (not a fixed shape this project controls), so this uses
// `Record<string, unknown>` plus targeted type guards for the well-known claims (exp, scope)
// rather than a Zod schema - there's nothing to validate structurally beyond "is this valid
// base64url JSON", which the try/catch below already enforces.

export interface DecodedJwt {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  expiry: {
    exp: number | null
    isExpired: boolean | null
    relativeDescription: string | null
  }
  scope: string[] | null
}

export type JwtDecodeResult =
  { success: true; decoded: DecodedJwt } | { success: false; error: string }

function base64UrlDecode(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const RELATIVE_UNITS: [number, string][] = [
  [86400, 'day'],
  [3600, 'hour'],
  [60, 'minute'],
]

function formatRelativeTime(diffSeconds: number): string {
  const absSeconds = Math.abs(diffSeconds)
  for (const [unitSeconds, label] of RELATIVE_UNITS) {
    if (absSeconds >= unitSeconds) {
      const count = Math.floor(absSeconds / unitSeconds)
      return `${String(count)} ${label}${count === 1 ? '' : 's'}`
    }
  }
  const seconds = Math.floor(absSeconds)
  return `${String(seconds)} second${seconds === 1 ? '' : 's'}`
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringArrayFrom(value: unknown): string[] | null {
  if (typeof value === 'string') {
    const parts = value.split(' ').filter((part) => part.length > 0)
    return parts.length > 0 ? parts : null
  }
  if (Array.isArray(value)) {
    const strings = value.filter((item): item is string => typeof item === 'string')
    return strings.length > 0 ? strings : null
  }
  return null
}

function parseScopeClaim(payload: Record<string, unknown>): string[] | null {
  return stringArrayFrom(payload.scope) ?? stringArrayFrom(payload.scp)
}

export function decodeJwt(token: string): JwtDecodeResult {
  const parts = token.trim().split('.')

  if (parts.length !== 3) {
    return {
      success: false,
      error: `A JWT has 3 dot-separated segments; this has ${String(parts.length)}.`,
    }
  }

  const headerSegment = parts[0]
  const payloadSegment = parts[1]
  if (!headerSegment || !payloadSegment) {
    return { success: false, error: 'One or more JWT segments were empty.' }
  }

  let header: unknown
  let payload: unknown
  try {
    header = JSON.parse(base64UrlDecode(headerSegment))
  } catch {
    return {
      success: false,
      error: "Could not decode the header segment - it isn't valid base64url JSON.",
    }
  }
  try {
    payload = JSON.parse(base64UrlDecode(payloadSegment))
  } catch {
    return {
      success: false,
      error: "Could not decode the payload segment - it isn't valid base64url JSON.",
    }
  }

  if (!isPlainObject(header)) {
    return { success: false, error: 'The header did not decode to a JSON object.' }
  }
  if (!isPlainObject(payload)) {
    return { success: false, error: 'The payload did not decode to a JSON object.' }
  }

  const exp = typeof payload.exp === 'number' ? payload.exp : null
  const nowSeconds = Date.now() / 1000
  const isExpired = exp === null ? null : exp < nowSeconds
  const relativeDescription =
    exp === null || isExpired === null
      ? null
      : isExpired
        ? `expired ${formatRelativeTime(nowSeconds - exp)} ago`
        : `expires in ${formatRelativeTime(exp - nowSeconds)}`

  return {
    success: true,
    decoded: {
      header,
      payload,
      expiry: { exp, isExpired, relativeDescription },
      scope: parseScopeClaim(payload),
    },
  }
}
