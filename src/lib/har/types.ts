export type HarFindingType =
  | 'failed-request'
  | 'auth-missing'
  | 'auth-malformed'
  | 'cors-preflight-failure'
  | 'redirect-chain'
  | 'slow-request'
  | 'mixed-content'

export interface HarFinding {
  type: HarFindingType
  severity: 'info' | 'warning' | 'error'
  message: string
  method: string
  url: string
  status: number | null
}

export interface HarSummary {
  totalRequests: number
  findings: HarFinding[]
}
