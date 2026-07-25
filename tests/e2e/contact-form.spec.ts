import { expect, test } from '@playwright/test'

test.describe('contact form', () => {
  test('shows field errors on an invalid submission', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel('Name').fill('Ada')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Message').fill('too short')
    await page.getByRole('button', { name: 'Send message' }).click()

    await expect(page.getByRole('alert').first()).toBeVisible()
    await expect(page.getByText('Enter a valid email address.')).toBeVisible()
    await expect(
      page.getByText('Say a little more about the opportunity (12+ characters).'),
    ).toBeVisible()

    // Values the visitor already typed survive the round trip.
    await expect(page.getByLabel('Name')).toHaveValue('Ada')
  })

  test('accepts a valid submission', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel('Name').fill('Ada Lovelace')
    await page.getByLabel('Email').fill('ada@example.com')
    await page
      .getByLabel('Message')
      .fill('We have a TSE opening and would like to talk about your background.')
    await page.getByRole('button', { name: 'Send message' }).click()

    // No FORMSPREE_ENDPOINT is configured in this environment, so a valid submission falls
    // back to a mailto: link rather than a bare "sent" confirmation - both are real,
    // documented outcomes of the same server action, not a test-only stand-in.
    await expect(page.getByRole('status')).toContainText('No email service is configured yet.')
    await expect(page.getByRole('link', { name: /send a prefilled email/i })).toHaveAttribute(
      'href',
      /^mailto:/,
    )
  })
})
