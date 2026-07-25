export const THEME_COOKIE_NAME = 'theme'
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

export type Theme = 'light' | 'dark'

export function parseTheme(value: string | undefined): Theme | undefined {
  return value === 'light' || value === 'dark' ? value : undefined
}
