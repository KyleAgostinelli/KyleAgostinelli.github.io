import { afterEach, describe, expect, it, vi } from 'vitest'
import { submitContactForm } from './submit-contact-form'

function buildFormData(overrides: Partial<Record<string, string>> = {}): FormData {
  const defaults = {
    name: 'Jamie Rivera',
    email: 'jamie@example.com',
    company: 'Acme',
    opportunityType: 'TSE / Support Engineer',
    message: 'We have an opening that looks like a strong fit for your background.',
  }
  const values = { ...defaults, ...overrides }
  const formData = new FormData()
  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value)
  }
  return formData
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('submitContactForm', () => {
  it('returns a fallback mailto link when no Formspree endpoint is configured', async () => {
    const result = await submitContactForm(buildFormData(), undefined)

    expect(result.status).toBe('fallback')
    if (result.status === 'fallback') {
      expect(result.mailtoHref.startsWith('mailto:')).toBe(true)
    }
  })

  it('returns typed field errors and echoes every submitted value on validation failure', async () => {
    const result = await submitContactForm(buildFormData({ name: '', message: 'short' }), undefined)

    expect(result.status).toBe('invalid')
    if (result.status === 'invalid') {
      expect(result.fieldErrors.name).toBe('Enter your name.')
      expect(result.fieldErrors.message).toBeDefined()
      // Fields that WERE valid are still echoed back - nothing the user typed is lost.
      expect(result.values.email).toBe('jamie@example.com')
      expect(result.values.company).toBe('Acme')
      expect(result.values.message).toBe('short')
    }
  })

  it('reports a field error for an invalid opportunity type', async () => {
    const result = await submitContactForm(
      buildFormData({ opportunityType: 'Not A Real Type' }),
      undefined,
    )

    expect(result.status).toBe('invalid')
    if (result.status === 'invalid') {
      expect(result.fieldErrors.opportunityType).toBeDefined()
    }
  })

  it('reports a field error for a malformed email address', async () => {
    const result = await submitContactForm(buildFormData({ email: 'not-an-email' }), undefined)

    expect(result.status).toBe('invalid')
    if (result.status === 'invalid') {
      expect(result.fieldErrors.email).toBeDefined()
    }
  })

  it('posts to Formspree and returns success on a 2xx response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await submitContactForm(buildFormData(), 'https://formspree.io/f/test')

    expect(result.status).toBe('success')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://formspree.io/f/test',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('returns a typed error when Formspree responds with a non-ok status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 422 })))

    const result = await submitContactForm(buildFormData(), 'https://formspree.io/f/test')

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.message).toMatch(/rejected/i)
    }
  })

  it('returns a typed error when the fetch call itself rejects (network/DNS failure)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')))

    const result = await submitContactForm(buildFormData(), 'https://formspree.io/f/test')

    expect(result.status).toBe('error')
    if (result.status === 'error') {
      expect(result.message).toMatch(/did not respond/i)
    }
  })
})
