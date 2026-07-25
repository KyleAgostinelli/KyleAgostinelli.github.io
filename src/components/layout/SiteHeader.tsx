import Link from 'next/link'
import { profile } from '@/content/profile'
import { MobileNav, type NavItem } from './MobileNav'
import { ThemeToggle } from './ThemeToggle'

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Tools', href: '/tools' },
  { label: 'About', href: '/about' },
  { label: 'Notes', href: '/notes' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="reveal font-heading text-lg font-semibold text-ink">
          {profile.name}
        </Link>

        <div className="reveal flex items-center gap-5" style={{ animationDelay: '60ms' }}>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-7">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm uppercase tracking-wide text-ink-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeToggle />
          <MobileNav navItems={navItems} />
        </div>
      </div>
    </header>
  )
}
