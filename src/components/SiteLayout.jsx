import { useEffect, useState } from 'react'
import { BriefcaseBusiness, Code2, Menu, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { contactInfo } from '../data/portfolio'
import AcademicBackdrop from './AcademicBackdrop'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const socialItems = [
  { label: 'GitHub', href: contactInfo.github, icon: Code2 },
  {
    label: 'LinkedIn',
    href: contactInfo.linkedin,
    icon: BriefcaseBusiness,
  },
]

function navLinkClass({ isActive }) {
  return `nav-link ${isActive ? 'nav-link-active' : ''}`
}

export default function SiteLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [location.pathname])

  return (
    <div className="relative min-h-screen text-neutral-100 selection:bg-blue-500 selection:text-white">
      <AcademicBackdrop />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-app" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050608]/90 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="flex h-20 items-center justify-between gap-6">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="group flex items-center gap-3 transition"
            >
              <span aria-hidden="true" className="logo-mark">
                KA
              </span>
              <span>
                <span className="block font-heading text-[1.24rem] font-semibold text-neutral-50">
                  {contactInfo.name}
                </span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300/90">
                  Support Agent Dossier
                </span>
              </span>
            </Link>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-neutral-950/80 text-blue-100 transition hover:border-blue-300/50 md:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>

            <nav className="hidden items-center gap-7 md:flex">
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
        </div>

        {isMenuOpen ? (
          <nav className="mx-auto flex w-full max-w-7xl flex-col border-t border-white/10 bg-[#050608]/96 px-4 py-3 sm:px-6 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className="border-b border-neutral-800 py-3 font-mono text-xs uppercase tracking-[0.14em] text-neutral-300 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </header>

      <main id="content" className="mx-auto w-full max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pt-8">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 bg-[#050608]/82">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.16em]">
            Built as a personal diagnostic portfolio for TSE conversations.
          </p>
          <div className="flex items-center gap-4">
            {socialItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="icon-link"
                >
                  <Icon size={14} aria-hidden="true" />
                  {item.label}
                </a>
              )
            })}
          </div>
        </div>
      </footer>
    </div>
  )
}
