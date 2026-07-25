import { achievements, contactInfo, metrics, projects, skillGroups, skillTags, supportCase, timeline } from '../data/portfolio'

const routeHandlers = {
  '/api/profile': () => ({
    name: contactInfo.name,
    target_role: contactInfo.targetRole,
    location: contactInfo.location,
    headline: 'TSE-ready support specialist focused on SaaS, APIs, and clear customer outcomes.',
    metrics: metrics.map(({ label, value }) => ({ label, value })),
    links: {
      resume: contactInfo.resume,
      github: contactInfo.github,
      linkedin: contactInfo.linkedin,
    },
  }),
  '/api/skills': () => ({
    primary: skillTags,
    groups: skillGroups,
    signal:
      'Practical troubleshooting across API, SaaS, cloud-connected systems, networking, support tooling, and customer communication.',
  }),
  '/api/projects': () => ({
    count: projects.length,
    projects: projects.map(({ name, stage, summary, supportAngle, signals }) => ({
      name,
      stage,
      summary,
      support_angle: supportAngle,
      signals,
    })),
  }),
  '/api/resume': () => ({
    download_url: contactInfo.resume,
    experience: timeline,
    achievements,
  }),
  '/api/cases/auth-failure': () => supportCase,
}

const statusText = {
  200: 'OK',
  404: 'Not Found',
  422: 'Unprocessable Entity',
}

export const portfolioEndpoints = [
  { method: 'GET', path: '/api/profile', label: 'Profile' },
  { method: 'GET', path: '/api/skills', label: 'Skills' },
  { method: 'GET', path: '/api/projects', label: 'Projects' },
  { method: 'GET', path: '/api/resume', label: 'Resume' },
  { method: 'GET', path: '/api/cases/auth-failure', label: 'Auth Case' },
]

function normalizePath(path) {
  const nextPath = String(path || '').trim()
  if (!nextPath) return '/'
  return nextPath.startsWith('/') ? nextPath : `/${nextPath}`
}

function hasPayload(body) {
  if (body == null) return false
  if (typeof body === 'string') return body.trim().length > 0
  if (Array.isArray(body)) return body.length > 0
  if (typeof body === 'object') return Object.keys(body).length > 0
  return true
}

function buildResponse(request, status, data, latencyMs) {
  return {
    request,
    response: {
      status,
      statusText: statusText[status],
      latencyMs,
      data,
    },
  }
}

export function makePortfolioRequest({ method = 'GET', path = '/api/profile', body = null }) {
  const request = {
    method: String(method || 'GET').toUpperCase(),
    path: normalizePath(path),
    body,
  }
  const latencyMs = 42 + request.path.length * 3

  if (body?.__parseError) {
    return buildResponse(
      request,
      422,
      {
        error: 'invalid_json',
        message: 'Request body must be valid JSON before it can be processed.',
      },
      latencyMs,
    )
  }

  if (!request.path.startsWith('/api/')) {
    return buildResponse(
      request,
      404,
      {
        error: 'not_found',
        message: 'Case file resources live under /api/. Try /api/profile.',
      },
      latencyMs,
    )
  }

  if (request.method !== 'GET') {
    return buildResponse(
      request,
      422,
      {
        error: 'unsupported_method',
        message: 'This browser-side portfolio API is read-only. Use GET for portfolio resources.',
      },
      latencyMs,
    )
  }

  if (hasPayload(body)) {
    return buildResponse(
      request,
      422,
      {
        error: 'unexpected_payload',
        message: 'GET portfolio endpoints do not accept a request body.',
      },
      latencyMs,
    )
  }

  const handler = routeHandlers[request.path]
  if (!handler) {
    return buildResponse(
      request,
      404,
      {
        error: 'not_found',
        message: `No portfolio resource exists at ${request.path}.`,
        available: Object.keys(routeHandlers),
      },
      latencyMs,
    )
  }

  return buildResponse(request, 200, handler(), latencyMs)
}
