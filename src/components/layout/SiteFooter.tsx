import { BriefcaseBusiness, Code2 } from 'lucide-react'
import { profile } from '@/content/profile'

const socialLinks = [
  { label: 'GitHub', href: profile.github, icon: Code2 },
  { label: 'LinkedIn', href: profile.linkedin, icon: BriefcaseBusiness },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-neutral-400">
        <p>
          {profile.name} - {profile.location}
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                <Icon size={14} aria-hidden="true" />
                {item.label}
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
