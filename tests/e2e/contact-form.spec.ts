import { expect, test } from '@playwright/test'

test.describe('contact form', () => {
  test('shows field errors on an invalid submission', async ({ page }) => {
    await page.goto('/contact')

    await page.getByLabel('Name').fill('Ada')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Message').fill('too short')

    // See the comment in the test below - the anti-bot timing check runs before field
    // validation, so even an invalid submission needs to clear it to reach that code path.
    await page.waitForTimeout(1700)
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

    // The server action rejects anything submitted faster than a human plausibly could
    // (see MIN_SUBMIT_MS in app/contact/schema.ts) - Playwright fills the form far quicker
    // than that, so this waits it out rather than tripping the same anti-bot check a real
    // spam submission would.
    await page.waitForTimeout(1700)
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
