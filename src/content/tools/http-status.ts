import { z } from 'zod'
import { nonEmptyString } from '../schema'

const httpStatusEntrySchema = z.object({
  code: z.number().int().min(200).max(599),
  reasonPhrase: nonEmptyString,
  category: z.enum(['success', 'redirection', 'client-error', 'server-error']),
  // Per RFC 9110, these three codes must never carry a response body - the explanation for
  // them has to travel some other way. See app/api/http/[status]/route.ts.
  nullBody: z.boolean(),
  meaning: nonEmptyString,
  commonCauses: z.array(nonEmptyString).min(1),
  whatToCheckFirst: z.array(nonEmptyString).min(1),
})
export type HttpStatusEntry = z.infer<typeof httpStatusEntrySchema>

const entries: HttpStatusEntry[] = z.array(httpStatusEntrySchema).parse([
  {
    code: 200,
    reasonPhrase: 'OK',
    category: 'success',
    nullBody: false,
    meaning: 'The request succeeded and the response body contains the result.',
    commonCauses: [
      'This is the expected outcome of a working request - there is no "cause" in the error sense.',
    ],
    whatToCheckFirst: [
      "If something still looks wrong with a 200, the problem is almost never the HTTP layer - it's in the response body or the business logic that produced it.",
      'Confirm the response body actually matches what the caller expected, not just that the status is green.',
    ],
  },
  {
    code: 201,
    reasonPhrase: 'Created',
    category: 'success',
    nullBody: false,
    meaning: 'The request succeeded and a new resource was created as a result.',
    commonCauses: ['Normal outcome of a successful POST that creates a resource.'],
    whatToCheckFirst: [
      'Check for a Location header pointing at the new resource - its absence is a common integration gap, not a bug in this status code.',
    ],
  },
  {
    code: 202,
    reasonPhrase: 'Accepted',
    category: 'success',
    nullBody: false,
    meaning: 'The request was accepted for processing, but processing is not complete yet.',
    commonCauses: [
      'Used by async/queued workflows: the request is valid and queued, but the actual work happens later.',
    ],
    whatToCheckFirst: [
      'A 202 is not a promise of success - find out how the caller is supposed to check final status (a webhook, a polling endpoint, a job ID).',
      'Customers reporting "it didn\'t work" after a 202 usually mean the async step never completed, not that the initial request failed.',
    ],
  },
  {
    code: 204,
    reasonPhrase: 'No Content',
    category: 'success',
    nullBody: true,
    meaning:
      'The request succeeded and there is intentionally no response body. Per HTTP spec, this status can never carry a body - if you were expecting JSON back, an empty response is correct behavior, not a bug.',
    commonCauses: [
      'Common on successful DELETE requests, and on PUT/PATCH that choose not to echo the updated resource.',
    ],
    whatToCheckFirst: [
      "Confirm the client isn't trying to parse a JSON body that was never going to exist.",
      'If a caller expected the updated resource back, check the API docs - many APIs use 200 with a body for that, reserving 204 for "done, nothing to return."',
    ],
  },
  {
    code: 301,
    reasonPhrase: 'Moved Permanently',
    category: 'redirection',
    nullBody: false,
    meaning: 'The resource has permanently moved to a new URL, given in the Location header.',
    commonCauses: [
      'A URL structure changed and the old path now redirects.',
      'HTTP-to-HTTPS or bare-domain-to-www redirects.',
    ],
    whatToCheckFirst: [
      'Check whether the client follows redirects automatically - some HTTP libraries and most browsers do, but strict API clients sometimes do not.',
      'A POST that hits a 301 may get re-sent as a GET by some clients, silently dropping the request body - worth confirming if data seems to vanish.',
    ],
  },
  {
    code: 302,
    reasonPhrase: 'Found',
    category: 'redirection',
    nullBody: false,
    meaning: 'The resource is temporarily at a different URL, given in the Location header.',
    commonCauses: ['Login flows, temporary maintenance redirects, load-balancer routing.'],
    whatToCheckFirst: [
      'Same redirect-chain and method-preservation caveats as 301 - check whether the client actually follows it, and whether it changes the request method.',
    ],
  },
  {
    code: 304,
    reasonPhrase: 'Not Modified',
    category: 'redirection',
    nullBody: true,
    meaning:
      'The cached copy the client already has is still valid. Per HTTP spec, this status can never carry a body - the explanation for this code arrives via response headers instead.',
    commonCauses: [
      'Conditional requests (If-None-Match / If-Modified-Since) confirming a cache is still fresh.',
    ],
    whatToCheckFirst: [
      'A customer reporting stale data after a 304 usually means the cache validator (ETag/Last-Modified) is stale on the server side, not that the client did anything wrong.',
      'Check whether the client is sending conditional headers at all - a 304 only happens if it asked for one.',
    ],
  },
  {
    code: 307,
    reasonPhrase: 'Temporary Redirect',
    category: 'redirection',
    nullBody: false,
    meaning:
      'Same as 302, but explicitly guarantees the request method and body are preserved on the redirect.',
    commonCauses: [
      'APIs that need a redirect but cannot risk a POST being silently downgraded to a GET.',
    ],
    whatToCheckFirst: [
      'Confirm the client library actually respects the method-preservation guarantee - not all of them do correctly.',
    ],
  },
  {
    code: 400,
    reasonPhrase: 'Bad Request',
    category: 'client-error',
    nullBody: false,
    meaning:
      'The server could not understand or process the request as sent - malformed syntax, not an auth or permissions issue.',
    commonCauses: [
      'Malformed JSON body.',
      'A required field missing or the wrong type.',
      'A query parameter in a format the server does not accept.',
    ],
    whatToCheckFirst: [
      'Get the exact request body and headers, not a paraphrase - most 400s are visible immediately once you see the literal payload.',
      'Check for encoding issues (e.g. a value that needed URL-encoding and was not).',
    ],
  },
  {
    code: 401,
    reasonPhrase: 'Unauthorized',
    category: 'client-error',
    nullBody: false,
    meaning:
      'The request has no valid authentication credentials - despite the name, this is about identity, not permission.',
    commonCauses: [
      'Missing or malformed Authorization header.',
      'Expired or revoked token.',
      'Token issued for a different environment (e.g. sandbox vs. production).',
    ],
    whatToCheckFirst: [
      'Confirm a credential was actually sent - a surprising number of "401s" are a missing header, not a bad one.',
      'Check token expiry and issuance time before assuming the credential itself is invalid.',
    ],
  },
  {
    code: 403,
    reasonPhrase: 'Forbidden',
    category: 'client-error',
    nullBody: false,
    meaning:
      'The credentials are valid, but they do not have permission for this specific action or resource.',
    commonCauses: [
      'A valid token missing the required scope/permission.',
      'IP allowlisting or account-level feature restrictions.',
      'Attempting an action reserved for a different role.',
    ],
    whatToCheckFirst: [
      'Confirm this is actually 403 and not 401 - customers and even logs sometimes conflate the two.',
      'Check the specific scope or permission the endpoint requires against what the credential actually has.',
    ],
  },
  {
    code: 404,
    reasonPhrase: 'Not Found',
    category: 'client-error',
    nullBody: false,
    meaning:
      'Nothing exists at the requested URL - or the server is deliberately not revealing that it does.',
    commonCauses: [
      'A typo or stale URL/ID (e.g. a resource that was deleted).',
      'Hitting the wrong environment (staging URL against a production ID, or vice versa).',
      'Some APIs return 404 instead of 403 on purpose, to avoid confirming a resource exists to someone without access.',
    ],
    whatToCheckFirst: [
      'Verify the exact URL and ID being requested character-for-character - path typos are the single most common cause.',
      'Confirm which environment is actually being hit.',
    ],
  },
  {
    code: 405,
    reasonPhrase: 'Method Not Allowed',
    category: 'client-error',
    nullBody: false,
    meaning:
      'The URL exists, but not for the HTTP method used (e.g. a POST to a GET-only endpoint).',
    commonCauses: [
      'Client code using the wrong verb.',
      'An API that changed which methods a route supports.',
    ],
    whatToCheckFirst: [
      'Check the Allow response header, if present - it usually lists which methods actually are supported.',
    ],
  },
  {
    code: 408,
    reasonPhrase: 'Request Timeout',
    category: 'client-error',
    nullBody: false,
    meaning: 'The server gave up waiting for the client to finish sending the request.',
    commonCauses: [
      'Slow or unstable client-side network.',
      'A client holding a connection open without sending data.',
    ],
    whatToCheckFirst: [
      'This is about the request upload, not the response - check the client network path, not server load.',
    ],
  },
  {
    code: 409,
    reasonPhrase: 'Conflict',
    category: 'client-error',
    nullBody: false,
    meaning: 'The request conflicts with the current state of the resource on the server.',
    commonCauses: [
      'A duplicate create (e.g. a unique field that already exists).',
      'Two clients editing the same resource at once (a version/ETag mismatch).',
    ],
    whatToCheckFirst: [
      'Check what specifically already exists or has changed - the response body usually says which field or record conflicted.',
    ],
  },
  {
    code: 422,
    reasonPhrase: 'Unprocessable Entity',
    category: 'client-error',
    nullBody: false,
    meaning:
      'The request is syntactically valid (well-formed JSON, etc.) but fails semantic/business-rule validation.',
    commonCauses: [
      'A field that is present and well-typed but violates a business rule (e.g. an end date before a start date).',
      'Cross-field validation failures a simple type check would not catch.',
    ],
    whatToCheckFirst: [
      'Read the validation error detail in the response body closely - 422s usually come with a specific field-level explanation, unlike a bare 400.',
    ],
  },
  {
    code: 429,
    reasonPhrase: 'Too Many Requests',
    category: 'client-error',
    nullBody: false,
    meaning: 'The client has sent too many requests in a given window and is being rate limited.',
    commonCauses: [
      'A client polling too aggressively.',
      'A burst of retries without backoff amplifying the original problem.',
    ],
    whatToCheckFirst: [
      'Check for a Retry-After header and confirm the client actually honors it.',
      'Look for a retry loop with no backoff - a naive retry-on-429 makes the situation worse, not better.',
    ],
  },
  {
    code: 500,
    reasonPhrase: 'Internal Server Error',
    category: 'server-error',
    nullBody: false,
    meaning:
      'The server encountered an unexpected condition and failed - a generic catch-all, not a specific diagnosis.',
    commonCauses: [
      'An unhandled exception in server-side code.',
      'A downstream dependency failing in a way the server did not expect.',
    ],
    whatToCheckFirst: [
      'This is squarely a server-side investigation - get a request ID and timestamp and hand it to engineering rather than guessing from the client side.',
    ],
  },
  {
    code: 502,
    reasonPhrase: 'Bad Gateway',
    category: 'server-error',
    nullBody: false,
    meaning:
      'A server acting as a gateway or proxy got an invalid response from an upstream server.',
    commonCauses: [
      'An upstream service crashed or returned malformed data.',
      'A proxy/load balancer misconfiguration.',
    ],
    whatToCheckFirst: [
      "This is almost never the client's fault - confirm which upstream dependency is actually failing before escalating.",
    ],
  },
  {
    code: 503,
    reasonPhrase: 'Service Unavailable',
    category: 'server-error',
    nullBody: false,
    meaning:
      'The server is temporarily unable to handle the request - overloaded, or down for maintenance.',
    commonCauses: [
      'Planned maintenance.',
      'Capacity exceeded during a traffic spike.',
      'A dependency outage cascading upward.',
    ],
    whatToCheckFirst: [
      'Check for a Retry-After header.',
      'Confirm whether this is a known, scheduled event before treating it as an incident.',
    ],
  },
  {
    code: 504,
    reasonPhrase: 'Gateway Timeout',
    category: 'server-error',
    nullBody: false,
    meaning: 'A server acting as a gateway did not get a timely response from an upstream server.',
    commonCauses: [
      'A slow downstream dependency.',
      'A timeout configured too aggressively for a legitimately slow operation.',
    ],
    whatToCheckFirst: [
      "Get the actual timing - how long did it wait? - and compare against the upstream service's own reported latency.",
    ],
  },
] satisfies HttpStatusEntry[])

const byCode = new Map(entries.map((entry) => [entry.code, entry]))

export function getHttpStatusEntry(code: number): HttpStatusEntry | undefined {
  return byCode.get(code)
}

export function categoryForCode(code: number): HttpStatusEntry['category'] {
  if (code < 300) return 'success'
  if (code < 400) return 'redirection'
  if (code < 500) return 'client-error'
  return 'server-error'
}

export const quickLinkCodes = [
  200, 201, 204, 301, 304, 400, 401, 403, 404, 422, 429, 500, 502, 503,
] as const

// Shared between the route handler (server-side output shape) and the client-side explorer
// (validates the response crossing the network before rendering it) - one source of truth.
export const diagnosticPayloadSchema = z.object({
  status: z.number(),
  reasonPhrase: z.string().nullable(),
  category: z.string(),
  meaning: nonEmptyString,
  commonCauses: z.array(z.string()),
  whatToCheckFirst: z.array(z.string()),
})
export type DiagnosticPayload = z.infer<typeof diagnosticPayloadSchema>
