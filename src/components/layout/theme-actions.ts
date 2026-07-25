'use server'

import { cookies } from 'next/headers'
import { parseTheme, THEME_COOKIE_MAX_AGE, THEME_COOKIE_NAME, type Theme } from '@/lib/theme'

export async function toggleTheme(): Promise<void> {
  const cookieStore = await cookies()
  const current = parseTheme(cookieStore.get(THEME_COOKIE_NAME)?.value)

  // No stored preference yet: the page was rendering via `prefers-color-scheme` alone,
  // which this server action has no way to detect (no client-side signal is sent with the
  // request). Treating the absent case as "light" means the first toggle always switches
  // to dark; a visitor whose system already prefers dark needs a second click to reach
  // light. That's a documented tradeoff, not a bug - the alternative is a client-side
  // matchMedia() check, which is exactly the flicker-prone pattern Phase 2 rules out.
  const next: Theme = current === 'dark' ? 'light' : 'dark'

  cookieStore.set(THEME_COOKIE_NAME, next, {
    maxAge: THEME_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  })
}
