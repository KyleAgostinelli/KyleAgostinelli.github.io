import { expect, test } from '@playwright/test'

test.describe('diagnostic tools', () => {
  test('HTTP status explorer fires a real request and shows the diagnostic', async ({ page }) => {
    await page.goto('/tools/status')
    await page.getByLabel('Status code').fill('404')
    await page.getByRole('button', { name: 'Fire request' }).click()

    await expect(page.getByText('404 Not Found')).toBeVisible()
    await expect(page.getByText('Response headers')).toBeVisible()
  })

  test('JWT decoder decodes a pasted token entirely client-side', async ({ page }) => {
    await page.goto('/tools/jwt')

    const header = { alg: 'HS256', typ: 'JWT' }
    const payload = { sub: '1234567890', name: 'Ada Lovelace', scope: 'read write' }
    const token = [
      Buffer.from(JSON.stringify(header)).toString('base64url'),
      Buffer.from(JSON.stringify(payload)).toString('base64url'),
      'signature',
    ].join('.')

    // Controlled textarea (value/onChange re-renders on every keystroke): WebKit's fill()
    // sets the native value without dispatching an input event React picks up, so the
    // component never sees the change. Real keystrokes work in every engine.
    await page.getByLabel('Paste a JWT').pressSequentially(token, { delay: 0 })

    await expect(page.getByText('read', { exact: true })).toBeVisible()
    await expect(page.getByText('write', { exact: true })).toBeVisible()
    await expect(page.getByText('"name": "Ada Lovelace"')).toBeVisible()
  })

  test('HAR analyzer parses a request/response pair server-side', async ({ page }) => {
    await page.goto('/tools/har')

    const pair = JSON.stringify({
      entries: [
        {
          method: 'GET',
          url: 'https://api.example.com/v1/things',
          status: 401,
          requestHeaders: {},
          responseHeaders: {},
        },
      ],
    })
    // Same controlled-textarea/WebKit caveat as the JWT decoder test above.
    await page.getByLabel(/Paste a HAR export/).pressSequentially(pair, { delay: 0 })
    await page.getByRole('button', { name: 'Analyze' }).click()

    await expect(page.getByText(/1 request analyzed/)).toBeVisible()
  })

  test('escalation formatter turns structured fields into a writeup', async ({ page }) => {
    await page.goto('/tools/escalation')

    await page.getByLabel('Ticket summary').fill('API calls return 401 after token rotation')
    await page.getByLabel('Impact').fill('Customer webhook processing is blocked.')
    await page.getByLabel('Scope').fill('One customer, one integration.')
    await page.getByLabel('Timestamp window start').fill('2026-01-15T14:00:00Z')
    await page.getByLabel('Timestamp window end').fill('2026-01-15T14:45:00Z')
    await page.getByLabel('Reproduction steps (one per line)').fill('Call POST /v1/webhooks')
    await page.getByLabel('The ask').fill('Confirm the token scope required by the endpoint.')
    await page.getByRole('button', { name: 'Generate escalation' }).click()

    await expect(page.getByText('API calls return 401 after token rotation')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Copy to clipboard' })).toBeVisible()
  })

  test('DNS walkthrough expands a step with no JavaScript required', async ({ page }) => {
    await page.goto('/tools/dns')

    const firstStep = page.locator('details').first()
    await expect(firstStep).not.toHaveAttribute('open', '')
    await firstStep.locator('summary').click()
    await expect(firstStep).toHaveAttribute('open', '')
    await expect(firstStep.getByText('What happens')).toBeVisible()
  })
})
