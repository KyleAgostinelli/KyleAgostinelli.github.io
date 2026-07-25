import { expect, test } from '@playwright/test'

test.describe('primary navigation', () => {
  test('desktop nav reaches every top-level route', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    const nav = page.getByRole('navigation', { name: 'Primary' })

    await nav.getByRole('link', { name: 'Work' }).click()
    await expect(page).toHaveURL(/\/work$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Work' })).toBeVisible()

    await nav.getByRole('link', { name: 'Tools' }).click()
    await expect(page).toHaveURL(/\/tools$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Tools' })).toBeVisible()

    await nav.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about$/)
    await expect(page.getByRole('heading', { level: 1, name: 'About' })).toBeVisible()

    await nav.getByRole('link', { name: 'Notes' }).click()
    await expect(page).toHaveURL(/\/notes$/)

    await nav.getByRole('link', { name: 'Contact' }).click()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Contact' })).toBeVisible()

    await nav.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL(/\/$/)
  })

  test('the work case study links through to a case detail page', async ({ page }) => {
    await page.goto('/work')
    await page.getByRole('link', { name: /read the full case/i }).click()
    await expect(page).toHaveURL(/\/work\/.+/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('the skip link jumps focus to main content', async ({ page, browserName }) => {
    // Safari's default keyboard behavior only tabs between form controls, not links, unless
    // the user turns on "Full Keyboard Access" - real Safari users hit the same limitation,
    // it isn't specific to this site. WebKit's Tab emulation matches that default.
    test.skip(browserName === 'webkit', 'WebKit does not Tab to links by default, like Safari')

    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#content')).toBeFocused()
  })
})
