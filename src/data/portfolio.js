export const contactInfo = {
  name: 'Kyle Agostinelli',
  title: 'Technical Support Specialist',
  targetRole: 'TSE / Support Specialist II',
  email: 'kyleagostinelli@protonmail.com',
  location: 'Iowa City, IA',
  github: 'https://github.com/KyleAgostinelli',
  linkedin: 'https://www.linkedin.com/in/kyle-agostinelli-075329237/',
  resume: '/KyleAgostinelli-Resume.pdf',
  avatar: 'https://avatars.githubusercontent.com/u/185490408?v=4',
}

export const metrics = [
  { label: '95%+ CSAT', value: 'Support quality benchmark', tone: 'success' },
  { label: '<5% transfer', value: 'Escalations kept low at scale', tone: 'info' },
  { label: '50 tickets/day', value: 'High-volume SaaS queue handling', tone: 'warning' },
  { label: '9x Most Helpful', value: 'Recognized for clarity and customer advocacy', tone: 'accent' },
]

export const skillTags = [
  'API Support',
  'SaaS Troubleshooting',
  'Authentication Issues',
  'Cloud-Connected Systems',
  'Networking',
  'Zendesk / Salesforce',
  'O365 Administration',
  'Customer Communication',
]

export const skillGroups = [
  {
    label: 'API + SaaS Support',
    skills: ['API Support', 'Authentication', 'Integrations', 'Product Support', 'Software Support'],
  },
  {
    label: 'Systems + IT',
    skills: ['DNS / DHCP / VLANs / TCP/IP', 'Windows / macOS', 'Active Directory / Azure AD', 'O365 Administration'],
  },
  {
    label: 'Support Operations',
    skills: ['Zendesk / Salesforce', 'Ticket Triage', 'Customer Communication', 'Process Improvement'],
  },
  {
    label: 'Web Foundations',
    skills: ['HTML', 'CSS', 'JavaScript', 'React Portfolio Build'],
  },
]

export const achievements = [
  'Handled up to 50 SaaS support tickets per day while resolving API, authentication, and integration issues.',
  'Maintained 95%+ CSAT with a transfer rate under 5% in a high-growth support environment.',
  'Recognized 9 times as "Most Helpful" for technical clarity and customer advocacy.',
  'Resolved 97% of tickets on first contact at Cable One and advanced into business support cases.',
  'Recovered $100K+ in critical project data while serving as IT Administrator at Calculated Fire Protection.',
]

export const timeline = [
  {
    role: 'Technical Consultant',
    company: 'Gerson Lehrman Group (GLG)',
    period: 'Jan 2024 - Present',
  },
  {
    role: 'Technical Support Specialist',
    company: 'Samsara',
    period: 'Feb 2023 - Mar 2024',
  },
  {
    role: 'Technical Sales Specialist',
    company: 'Asurion',
    period: 'May 2021 - Feb 2023',
  },
  {
    role: 'Technical Support Specialist',
    company: 'Cable One (Sparklight)',
    period: 'May 2021 - Feb 2023',
  },
  {
    role: 'IT Administrator',
    company: 'Calculated Fire Protection',
    period: 'Aug 2018 - Aug 2019',
  },
]

export const projects = [
  {
    name: 'DxId / Layer0 Blockchain',
    stage: 'Architecture + Early Build',
    summary: 'A web3 infrastructure concept centered on identity-aware interoperability at the Layer0 level.',
    supportAngle:
      'Useful in interviews as a systems-thinking example: identity context, integration assumptions, failure boundaries, and trust-aware routing.',
    details: [
      'Focuses on cross-chain identity context and trust-aware routing.',
      'Designed to support modular systems that can integrate with future app chains.',
      'Built as a foundational protocol experiment for long-term ecosystem tooling.',
    ],
    signals: ['Identity context', 'Interoperability', 'Failure-boundary thinking'],
  },
  {
    name: 'Longyield L1 Blockchain',
    stage: 'Protocol Design',
    summary:
      'An L1 concept with long-horizon economic alignment, aimed at sustainable rewards and network stability.',
    supportAngle:
      'Shows comfort with technical tradeoffs, reliability language, incentives, and explaining complex systems without losing the customer.',
    details: [
      'Explores staking and yield mechanics for long-term participant incentives.',
      'Emphasizes predictable validator economics and scalable transaction patterns.',
      'Positioned as a research-forward project with room for iterative development.',
    ],
    signals: ['Protocol design', 'Reliability framing', 'Technical communication'],
  },
]

export const supportCase = {
  id: 'case_auth_failure',
  title: 'API auth failure after token rotation',
  severity: 'SEV-2 customer integration degraded',
  status: 'Resolved with clear repro + next-step guidance',
  summary:
    'A SaaS customer reports that a previously healthy integration began returning 401 errors after an access token refresh.',
  symptoms: [
    'Webhook delivery succeeds, but follow-up API calls return 401.',
    'Customer confirms the integration worked before a credential rotation.',
    'Retrying with the old token fails, and the new token lacks the expected scope.',
  ],
  evidence: [
    'Response headers indicate valid request shape but rejected authorization.',
    'Request logs show the integration is calling the correct endpoint.',
    'Scope mismatch appears only after the refresh event.',
  ],
  likelyRootCause: 'The refreshed credential was issued without the integration scope required by the endpoint.',
  troubleshootingSteps: [
    'Confirm the endpoint, method, and account context before changing anything.',
    'Compare the working request pattern against the failing request.',
    'Validate token scope and rotation history.',
    'Give the customer a minimal repro and a safe credential reissue path.',
  ],
  escalationNotes:
    'Escalate with request IDs, timestamp window, endpoint, token scope evidence, customer impact, and the exact reproduction steps.',
  customerSummary:
    'The integration is reaching the correct API, but the refreshed token does not include the scope required for this endpoint. Reissuing the credential with the integration scope should restore the workflow.',
}
