import { ImageResponse } from 'next/og'
import { profile } from '@/content/profile'

export const runtime = 'edge'
export const alt = `${profile.name} - ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Plain hex approximations of this site's OKLCH design tokens - Satori (the renderer behind
// ImageResponse) doesn't support oklch(), so these are hand-picked to match rather than
// computed from src/styles/globals.css directly.
const CANVAS = '#f9fafb'
const INK = '#1c1e24'
const INK_MUTED = '#6b6e76'
const ACCENT = '#5b4fe0'

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        backgroundColor: CANVAS,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ width: '64px', height: '6px', backgroundColor: ACCENT, display: 'flex' }} />
      <div
        style={{ marginTop: '36px', fontSize: 64, fontWeight: 700, color: INK, display: 'flex' }}
      >
        {profile.name}
      </div>
      <div style={{ marginTop: '20px', fontSize: 32, color: INK_MUTED, display: 'flex' }}>
        {profile.title} - {profile.targetRole}
      </div>
    </div>,
    { ...size },
  )
}
