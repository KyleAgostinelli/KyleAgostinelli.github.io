'use client'

// Client boundary: this is the only part of the header that needs browser state (open/close),
// a focus trap, and an Escape-key subscription. Everything else in the header stays server-rendered.

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

export interface NavItem {
  label: string
  href: string
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function MobileNav({ navItems }: { navItems: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()
  const toggleButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const panel = panelRef.current
    const focusable = panel
      ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        toggleButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <button
        ref={toggleButtonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => {
          setIsOpen((open) => !open)
        }}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink"
      >
        {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      {isOpen ? (
        <div id={panelId} ref={panelRef} className="border-t border-line py-2">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    className="block py-3 text-sm uppercase tracking-wide text-ink-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
