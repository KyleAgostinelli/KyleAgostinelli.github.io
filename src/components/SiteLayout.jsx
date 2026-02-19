import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const socialItems = [
  { label: 'GitHub', href: 'https://github.com/KyleAgostinelli' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kyle-agostinelli-075329237/',
  },
]

function navLinkClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-white/15 text-white shadow-glow'
      : 'text-slate-300 hover:bg-white/10 hover:text-white'
  }`
}

export default function SiteLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="relative min-h-screen text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-app">
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="aurora-grid" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060c16]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="font-heading text-lg font-semibold tracking-wide text-white transition hover:text-cyan-200"
          >
            Kyle Agostinelli
          </Link>

          <button
            type="button"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10 md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            Menu
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {isMenuOpen ? (
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap gap-2 px-4 pb-4 sm:px-6 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </header>

      <main id="content" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Outlet />
      </main>

      <footer className="mt-8 border-t border-white/10 bg-[#050a12]/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Built with React + Vite + Tailwind.</p>
          <div className="flex items-center gap-4">
            {socialItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-cyan-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
