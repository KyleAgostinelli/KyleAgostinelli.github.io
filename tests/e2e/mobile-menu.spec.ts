import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test.describe('mobile menu', () => {
  test('opens and closes with the mouse, exposing aria-expanded', async ({ page }) => {
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible()
  })

  test('is fully keyboard operable: open, trap focus, Escape to close', async ({ page }) => {
    await page.goto('/')

    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.focus()
    await page.keyboard.press('Enter')
    const nav = page.getByRole('navigation', { name: 'Mobile' })
    await expect(nav).toBeVisible()

    const links = nav.getByRole('link')
    await expect(links.first()).toBeFocused()

    // Shift+Tab from the first link should wrap to the last link inside the panel.
    await page.keyboard.press('Shift+Tab')
    await expect(links.last()).toBeFocused()

    await page.keyboard.press('Escape')
    await expect(nav).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
  })

  test('closes when a link inside it is activated by keyboard', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()

    const workLink = page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', {
      name: 'Work',
    })
    await workLink.focus()
    await page.keyboard.press('Enter')

    await expect(page).toHaveURL(/\/work$/)
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden()
  })
})
