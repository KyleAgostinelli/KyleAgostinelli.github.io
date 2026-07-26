import { ImageResponse } from 'next/og'
import { cases } from '@/content/cases'
import { profile } from '@/content/profile'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CANVAS = '#f9fafb'
const INK = '#1c1e24'
const INK_MUTED = '#6b6e76'
const ACCENT = '#5b4fe0'

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const supportCase = cases.find((c) => c.slug === params.slug)
  return [{ id: params.slug, alt: supportCase?.title ?? 'Case study', size, contentType }]
}

export default function CaseStudyOpengraphImage({ params }: { params: { slug: string } }) {
  const supportCase = cases.find((c) => c.slug === params.slug)

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
      <div style={{ marginTop: '32px', fontSize: 24, color: INK_MUTED, display: 'flex' }}>
        {supportCase?.role ?? 'Case study'}
      </div>
      <div
        style={{
          marginTop: '16px',
          fontSize: 52,
          fontWeight: 700,
          color: INK,
          display: 'flex',
          lineHeight: 1.15,
        }}
      >
        {supportCase?.title ?? 'Case study'}
      </div>
      <div style={{ marginTop: '28px', fontSize: 28, color: INK_MUTED, display: 'flex' }}>
        {profile.name}
      </div>
    </div>,
    { ...size },
  )
}
