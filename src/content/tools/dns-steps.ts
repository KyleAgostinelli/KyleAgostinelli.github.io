import { z } from 'zod'
import { nonEmptyString } from '../schema'

const dnsStepSchema = z.object({
  id: nonEmptyString,
  name: nonEmptyString,
  whatHappens: nonEmptyString,
  commonFailure: nonEmptyString,
  customerSymptom: nonEmptyString,
})
export type DnsStep = z.infer<typeof dnsStepSchema>

export const dnsSteps: DnsStep[] = z.array(dnsStepSchema).parse([
  {
    id: 'resolver',
    name: 'Resolver',
    whatHappens:
      "The client's OS/browser asks its configured DNS resolver (the ISP's, or a public one like 1.1.1.1 or 8.8.8.8) to resolve the hostname - checking its own cache first.",
    commonFailure:
      'The resolver is unreachable, misconfigured, or the client has no network connectivity at all.',
    customerSymptom:
      'Failure is near-instant, and every site fails, not just one - a strong signal this is local network or resolver configuration, not "the site is down."',
  },
  {
    id: 'root',
    name: 'Root nameservers',
    whatHappens:
      "If the resolver doesn't already have an answer cached, it asks one of the root nameserver clusters which servers handle the domain's top-level domain (.com, .org, etc.).",
    commonFailure:
      'Rare in practice - root infrastructure is heavily redundant. More likely: outbound DNS (port 53) is blocked by a firewall between the resolver and the internet.',
    customerSymptom:
      'If this genuinely fails, it takes down DNS resolution broadly, not one specific site.',
  },
  {
    id: 'tld',
    name: 'TLD nameservers',
    whatHappens:
      'The TLD server tells the resolver which authoritative nameservers are responsible for the specific domain being looked up.',
    commonFailure:
      'Domain registration expired, or the nameserver records at the registrar are wrong or missing.',
    customerSymptom:
      '"This site can\'t be found" (NXDOMAIN) for that one domain specifically, and consistently across every network and every user.',
  },
  {
    id: 'authoritative',
    name: 'Authoritative nameservers',
    whatHappens:
      "The domain's own authoritative nameserver (the DNS host - often the registrar, or a service like Cloudflare or Route 53) returns the actual record for the specific hostname queried.",
    commonFailure:
      'A DNS record was deleted or mistyped, or the authoritative nameserver itself is unreachable.',
    customerSymptom:
      'NXDOMAIN or a resolution failure for that one hostname, while the parent domain and sibling subdomains may still resolve fine.',
  },
  {
    id: 'a-cname',
    name: 'A / CNAME resolution',
    whatHappens:
      'The specific record type comes back: an A record (a literal IPv4 address) or a CNAME (an alias pointing at another hostname, which then gets resolved in turn).',
    commonFailure:
      'The record points at a stale or decommissioned target - a dangling CNAME, or an IP nothing listens on anymore.',
    customerSymptom:
      'Either a connection timeout (nothing answers at that address), or - more concerning - the wrong service answering at a stale IP.',
  },
  {
    id: 'tls',
    name: 'TLS handshake',
    whatHappens:
      'With an IP address in hand, the client opens a TCP connection and negotiates TLS: certificate exchange, SNI, and cipher/protocol agreement.',
    commonFailure:
      'An expired or mismatched certificate, wrong SNI configuration on the server, or a cipher/protocol version neither side will agree on.',
    customerSymptom:
      'A browser security warning ("Your connection is not private" / a NET::ERR_CERT_* code) - and critically, the domain DID resolve, which rules out DNS entirely as the cause.',
  },
  {
    id: 'http',
    name: 'HTTP request/response',
    whatHappens:
      'The actual HTTP request goes out over the now-encrypted connection, and the application returns a response.',
    commonFailure:
      'Anything at the application layer - see the HTTP status explorer for what a given response code actually means.',
    customerSymptom:
      'An actual page or error from the application itself, not a browser-level network error - meaning everything below the application layer worked.',
  },
] satisfies DnsStep[])
