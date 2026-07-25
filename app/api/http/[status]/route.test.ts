import { describe, expect, it } from 'vitest'
import { GET } from './route'

function callRoute(status: string): Promise<Response> {
  return GET(new Request(`http://localhost/api/http/${status}`), {
    params: Promise.resolve({ status }),
  })
}

describe('GET /api/http/:status', () => {
  it('returns the real status code with a matching JSON body for a normal status', async () => {
    const response = await callRoute('404')
    expect(response.status).toBe(404)
    const body: unknown = await response.json()
    expect(body).toMatchObject({ status: 404, reasonPhrase: 'Not Found' })
  })

  it('returns 400 for a status outside the valid range', async () => {
    const response = await callRoute('999')
    expect(response.status).toBe(400)
    const body = (await response.json()) as { error: { code: string } }
    expect(body.error.code).toBe('invalid_status_code')
  })

  it('returns 400 for a non-numeric status', async () => {
    const response = await callRoute('not-a-number')
    expect(response.status).toBe(400)
  })

  it('returns an empty body with the diagnostic in a header for 204', async () => {
    const response = await callRoute('204')
    expect(response.status).toBe(204)
    const text = await response.text()
    expect(text).toBe('')
    const header = response.headers.get('x-diagnostic')
    expect(header).toBeTruthy()
    const decoded: unknown = JSON.parse(decodeURIComponent(header ?? ''))
    expect(decoded).toMatchObject({ status: 204, reasonPhrase: 'No Content' })
  })

  it('returns an empty body with the diagnostic in a header for 304', async () => {
    const response = await callRoute('304')
    expect(response.status).toBe(304)
    expect(await response.text()).toBe('')
    expect(response.headers.get('x-diagnostic')).toBeTruthy()
  })

  it('still returns the real status for a code outside the curated reference set', async () => {
    const response = await callRoute('418')
    expect(response.status).toBe(418)
    const body = (await response.json()) as { reasonPhrase: string | null }
    expect(body.reasonPhrase).toBeNull()
  })
})
