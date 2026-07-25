// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MobileNav } from './MobileNav'

const navItems = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

describe('MobileNav', () => {
  it('is closed by default and opens on click, exposing the panel via aria-expanded', async () => {
    const user = userEvent.setup()
    render(<MobileNav navItems={navItems} />)

    const toggle = screen.getByRole('button', { name: 'Open menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()

    await user.click(toggle)

    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()
    navItems.forEach((item) => {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute('href', item.href)
    })
  })

  it('closes on Escape and returns focus to the toggle button', async () => {
    const user = userEvent.setup()
    render(<MobileNav navItems={navItems} />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus()
  })

  it('traps Tab focus inside the panel while open', async () => {
    const user = userEvent.setup()
    render(<MobileNav navItems={navItems} />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    const links = navItems.map((item) => screen.getByRole('link', { name: item.label }))
    const firstLink = links[0]
    const lastLink = links[links.length - 1]
    if (!firstLink || !lastLink) throw new Error('expected nav links to render')

    expect(firstLink).toHaveFocus()

    lastLink.focus()
    await user.tab()
    expect(firstLink).toHaveFocus()

    await user.tab({ shift: true })
    expect(lastLink).toHaveFocus()
  })

  it('closes when a nav link is activated', async () => {
    const user = userEvent.setup()
    render(<MobileNav navItems={navItems} />)

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    await user.click(screen.getByRole('link', { name: 'Work' }))

    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument()
  })
})
