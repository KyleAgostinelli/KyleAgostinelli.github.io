import Link from 'next/link'
import { profile } from '@/content/profile'
import { MobileNav, type NavItem } from './MobileNav'

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex h-20 w-full max-w-5xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          {profile.name}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm uppercase tracking-wide text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <MobileNav navItems={navItems} />
      </div>
    </header>
  )
}
