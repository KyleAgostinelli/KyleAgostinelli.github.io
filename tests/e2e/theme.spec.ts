import { expect, test } from '@playwright/test'

test.describe('theme toggle', () => {
  test('switches to dark, persists across reload, and back to light', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')

    // No cookie yet: no data-theme attribute at all (prefers-color-scheme drives it instead).
    await expect(html).not.toHaveAttribute('data-theme', /.+/)

    await page.getByRole('button', { name: 'Switch to dark theme' }).click()
    await expect(html).toHaveAttribute('data-theme', 'dark')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible()

    await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expect(html).toHaveAttribute('data-theme', 'light')

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', 'light')
  })

  test('the header and primary content stay visible in dark mode', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Switch to dark theme' }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })
})
