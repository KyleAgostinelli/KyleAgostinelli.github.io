import { Moon, Sun } from 'lucide-react'
import { cookies } from 'next/headers'
import { parseTheme, THEME_COOKIE_NAME } from '@/lib/theme'
import { toggleTheme } from './theme-actions'

// Server component: a <form action={toggleTheme}> flips a cookie and the layout re-renders
// server-side on the next request. No client JS, no flash - see theme-actions.ts for the
// one documented limitation (the icon assumes "light" when no cookie is set yet).
export async function ThemeToggle() {
  const cookieStore = await cookies()
  const isDark = parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value) === 'dark'

  return (
    <form action={toggleTheme}>
      <button
        type="submit"
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-accent hover:text-accent"
      >
        {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      </button>
    </form>
  )
}
