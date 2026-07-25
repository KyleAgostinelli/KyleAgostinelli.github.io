import { harFileSchema, simplePairFileSchema, type HarEntry, type SimplePairEntry } from './schema'
import type { HarFinding, HarSummary } from './types'

const SENSITIVE_HEADER_NAMES = new Set(['authorization', 'cookie', 'set-cookie'])
const SLOW_THRESHOLD_MS = 1500

interface NormalizedEntry {
  method: string
  url: string
  status: number
  requestHeaders: [string, string][]
  responseHeaders: [string, string][]
  redirectURL: string
  timeMs: number | null
  authPresence: 'absent' | 'malformed' | 'present'
}

// Redacts sensitive header VALUES immediately on normalization - never held onto, never
// logged, never echoed back past this point. Presence/malformed-ness is still computed
// before this runs, from the raw value, so the finding can say "missing" or "malformed"
// without ever exposing what the value actually was.
function redactHeaders(headers: [string, string][]): [string, string][] {
  return headers.map(([name, value]) =>
    SENSITIVE_HEADER_NAMES.has(name.toLowerCase()) ? [name, '[REDACTED]'] : [name, value],
  )
}

function findHeaderValue(headers: [string, string][], name: string): string | undefined {
  const lower = name.toLowerCase()
  return headers.find(([headerName]) => headerName.toLowerCase() === lower)?.[1]
}

function classifyAuthHeader(value: string | undefined): 'absent' | 'malformed' | 'present' {
  if (value === undefined || value.trim().length === 0) return 'absent'
  // Rough shape check: "<scheme> <credential>" - Bearer/Basic/etc, not a strict grammar.
  return /^\S+\s+\S+/.test(value.trim()) ? 'present' : 'malformed'
}

function normalizeHarEntry(entry: HarEntry): NormalizedEntry {
  const requestHeadersRaw = entry.request.headers.map((h): [string, string] => [h.name, h.value])
  const responseHeadersRaw = entry.response.headers.map((h): [string, string] => [h.name, h.value])

  return {
    method: entry.request.method,
    url: entry.request.url,
    status: entry.response.status,
    requestHeaders: redactHeaders(requestHeadersRaw),
    responseHeaders: redactHeaders(responseHeadersRaw),
    redirectURL: entry.response.redirectURL,
    timeMs: entry.time ?? entry.timings?.wait ?? null,
    authPresence: classifyAuthHeader(findHeaderValue(requestHeadersRaw, 'authorization')),
  }
}

function normalizeSimpleEntry(entry: SimplePairEntry): NormalizedEntry {
  const requestHeadersRaw = Object.entries(entry.requestHeaders)
  const responseHeadersRaw = Object.entries(entry.responseHeaders)

  return {
    method: entry.method,
    url: entry.url,
    status: entry.status,
    requestHeaders: redactHeaders(requestHeadersRaw),
    responseHeaders: redactHeaders(responseHeadersRaw),
    redirectURL: findHeaderValue(responseHeadersRaw, 'location') ?? '',
    timeMs: entry.timeMs ?? null,
    authPresence: classifyAuthHeader(findHeaderValue(requestHeadersRaw, 'authorization')),
  }
}

function detectFindings(entries: NormalizedEntry[]): HarFinding[] {
  const findings: HarFinding[] = []
  const hasHttps = entries.some((entry) => entry.url.startsWith('https://'))

  for (const entry of entries) {
    if (entry.status >= 400 || entry.status === 0) {
      findings.push({
        type: 'failed-request',
        severity: 'error',
        message: `${entry.method} ${entry.url} failed with status ${String(entry.status)}.`,
        method: entry.method,
        url: entry.url,
        status: entry.status,
      })
    }

    if (entry.authPresence === 'malformed') {
      findings.push({
        type: 'auth-malformed',
        severity: 'warning',
        message: `${entry.method} ${entry.url} sent an Authorization header that doesn't look like "<scheme> <credential>".`,
        method: entry.method,
        url: entry.url,
        status: entry.status,
      })
    } else if (entry.authPresence === 'absent' && (entry.status === 401 || entry.status === 403)) {
      findings.push({
        type: 'auth-missing',
        severity: 'warning',
        message: `${entry.method} ${entry.url} returned ${String(entry.status)} with no Authorization header sent at all.`,
        method: entry.method,
        url: entry.url,
        status: entry.status,
      })
    }

    if (entry.method === 'OPTIONS') {
      const allowOrigin = findHeaderValue(entry.responseHeaders, 'access-control-allow-origin')
      if (entry.status >= 400 || !allowOrigin) {
        findings.push({
          type: 'cors-preflight-failure',
          severity: 'error',
          message: allowOrigin
            ? `Preflight OPTIONS ${entry.url} failed with status ${String(entry.status)}.`
            : `Preflight OPTIONS ${entry.url} has no Access-Control-Allow-Origin response header.`,
          method: entry.method,
          url: entry.url,
          status: entry.status,
        })
      }
    }

    if (entry.status >= 300 && entry.status < 400) {
      findings.push({
        type: 'redirect-chain',
        severity: 'info',
        message: `${entry.method} ${entry.url} redirected (${String(entry.status)}) to ${entry.redirectURL || 'an unspecified location'}.`,
        method: entry.method,
        url: entry.url,
        status: entry.status,
      })
    }

    if (entry.timeMs !== null && entry.timeMs >= SLOW_THRESHOLD_MS) {
      findings.push({
        type: 'slow-request',
        severity: 'warning',
        message: `${entry.method} ${entry.url} took ${String(Math.round(entry.timeMs))}ms.`,
        method: entry.method,
        url: entry.url,
        status: entry.status,
      })
    }

    if (hasHttps && entry.url.startsWith('http://')) {
      findings.push({
        type: 'mixed-content',
        severity: 'warning',
        message: `${entry.method} ${entry.url} was requested over plain HTTP alongside HTTPS requests in the same trace.`,
        method: entry.method,
        url: entry.url,
        status: entry.status,
      })
    }
  }

  return findings
}

export type HarAnalysisResult =
  { success: true; summary: HarSummary } | { success: false; error: string }

export function analyzeHar(raw: unknown): HarAnalysisResult {
  const harResult = harFileSchema.safeParse(raw)
  if (harResult.success) {
    const entries = harResult.data.log.entries.map(normalizeHarEntry)
    return {
      success: true,
      summary: { totalRequests: entries.length, findings: detectFindings(entries) },
    }
  }

  const simpleResult = simplePairFileSchema.safeParse(raw)
  if (simpleResult.success) {
    const entries = simpleResult.data.entries.map(normalizeSimpleEntry)
    return {
      success: true,
      summary: { totalRequests: entries.length, findings: detectFindings(entries) },
    }
  }

  return {
    success: false,
    error:
      "Input didn't match either a HAR export (log.entries[]) or the simple {entries: [...]} request/response pair format.",
  }
}
