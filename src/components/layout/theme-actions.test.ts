import { beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_COOKIE_MAX_AGE, THEME_COOKIE_NAME } from '@/lib/theme'

const { getMock, setMock } = vi.hoisted(() => ({
  getMock: vi.fn<(name: string) => { value: string } | undefined>(),
  setMock: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: getMock, set: setMock }),
}))

// theme-actions.ts is a server action ('use server'); imported after the next/headers mock so
// the module under test resolves the mocked cookie jar instead of throwing outside a request.
const { toggleTheme } = await import('./theme-actions')

describe('toggleTheme', () => {
  beforeEach(() => {
    getMock.mockReset()
    setMock.mockReset()
  })

  it('switches to dark when no preference is stored yet', async () => {
    getMock.mockReturnValue(undefined)
    await toggleTheme()
    expect(setMock).toHaveBeenCalledWith(THEME_COOKIE_NAME, 'dark', {
      maxAge: THEME_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    })
  })

  it('switches from dark to light', async () => {
    getMock.mockReturnValue({ value: 'dark' })
    await toggleTheme()
    expect(setMock).toHaveBeenCalledWith(THEME_COOKIE_NAME, 'light', expect.any(Object))
  })

  it('switches from light to dark', async () => {
    getMock.mockReturnValue({ value: 'light' })
    await toggleTheme()
    expect(setMock).toHaveBeenCalledWith(THEME_COOKIE_NAME, 'dark', expect.any(Object))
  })

  it('treats an invalid stored value the same as unset', async () => {
    getMock.mockReturnValue({ value: 'neon' })
    await toggleTheme()
    expect(setMock).toHaveBeenCalledWith(THEME_COOKIE_NAME, 'dark', expect.any(Object))
  })
})
