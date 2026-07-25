import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Every real route in the app. /notes/[slug] has no real page yet - Kyle hasn't written a
// post, and there's nothing to render there until he does (see src/content/notes.ts).
const routes = [
  '/',
  '/work',
  '/work/samsara-nocode-api-integration',
  '/about',
  '/contact',
  '/notes',
  '/tools',
  '/tools/status',
  '/tools/har',
  '/tools/jwt',
  '/tools/escalation',
  '/tools/dns',
]

for (const route of routes) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    // The first-paint "reveal" animation fades text in from opacity: 0 over 500ms. Scanning
    // mid-fade makes axe measure a transient, partially-transparent color as a real contrast
    // failure. prefers-reduced-motion turns the animation off entirely (see globals.css), so
    // this scans the same settled state a real user with that preference always sees.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(route)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

    const seriousOrCritical = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    )

    expect(
      seriousOrCritical,
      seriousOrCritical
        .map((v) => `${v.id} (${String(v.impact)}): ${v.help} - ${String(v.nodes.length)} node(s)`)
        .join('\n'),
    ).toEqual([])
  })
}

test('the homepage has no serious or critical violations in dark mode', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )

  expect(
    seriousOrCritical,
    seriousOrCritical.map((v) => `${v.id} (${String(v.impact)}): ${v.help}`).join('\n'),
  ).toEqual([])
})
