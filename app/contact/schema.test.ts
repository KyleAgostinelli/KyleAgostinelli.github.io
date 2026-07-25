import { z } from 'zod'
import { describe, expect, it } from 'vitest'
import { buildMailtoHref, contactFormSchema, mailtoHrefSchema } from './schema'

const validInput = {
  name: 'Jamie Rivera',
  email: 'jamie@example.com',
  company: 'Acme',
  opportunityType: 'TSE / Support Engineer',
  message: 'We have an opening that looks like a strong fit for your background.',
}

describe('contactFormSchema', () => {
  it('accepts a fully valid submission', () => {
    expect(contactFormSchema.safeParse(validInput).success).toBe(true)
  })

  it('trims whitespace from text fields', () => {
    const result = contactFormSchema.safeParse({ ...validInput, name: '  Jamie Rivera  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Jamie Rivera')
    }
  })

  it('allows company to be omitted', () => {
    const { name, email, opportunityType, message } = validInput
    expect(contactFormSchema.safeParse({ name, email, opportunityType, message }).success).toBe(
      true,
    )
  })

  it('rejects a blank name', () => {
    const result = contactFormSchema.safeParse({ ...validInput, name: '   ' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(z.treeifyError(result.error).properties?.name?.errors[0]).toBe('Enter your name.')
    }
  })

  it('rejects a malformed email address', () => {
    const result = contactFormSchema.safeParse({ ...validInput, email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(z.treeifyError(result.error).properties?.email?.errors[0]).toBe(
        'Enter a valid email address.',
      )
    }
  })

  it('rejects an opportunity type outside the allowed list', () => {
    const result = contactFormSchema.safeParse({
      ...validInput,
      opportunityType: 'Nonexistent Role',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(z.treeifyError(result.error).properties?.opportunityType?.errors[0]).toBe(
        'Choose an opportunity type.',
      )
    }
  })

  it('rejects a message under 12 characters', () => {
    const result = contactFormSchema.safeParse({ ...validInput, message: 'too short' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(z.treeifyError(result.error).properties?.message?.errors[0]).toBe(
        'Say a little more about the opportunity (12+ characters).',
      )
    }
  })
})

describe('mailtoHrefSchema', () => {
  it('accepts a mailto: URI', () => {
    expect(mailtoHrefSchema.safeParse('mailto:test@example.com?subject=Hi').success).toBe(true)
  })

  it('rejects a non-mailto URL (the attacker-controlled-href case)', () => {
    expect(mailtoHrefSchema.safeParse('https://evil.example').success).toBe(false)
  })

  it('rejects a value that is not a URL at all', () => {
    expect(mailtoHrefSchema.safeParse('not a url').success).toBe(false)
  })
})

describe('buildMailtoHref', () => {
  it('always targets the configured contact address, never the submitter email', () => {
    const href = buildMailtoHref({
      name: 'Jamie Rivera',
      email: 'attacker-controlled@example.com',
      opportunityType: 'TSE / Support Engineer',
      message: 'We have an opening that looks like a strong fit for your background.',
    })
    expect(href.startsWith('mailto:kyleagostinelli@protonmail.com?')).toBe(true)
  })
})
