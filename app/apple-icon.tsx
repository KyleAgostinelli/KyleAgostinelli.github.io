import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

const ACCENT = '#5b4fe0'
const CANVAS = '#f9fafb'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ACCENT,
        color: CANVAS,
        fontSize: 84,
        fontWeight: 700,
        fontFamily: 'sans-serif',
      }}
    >
      KA
    </div>,
    { ...size },
  )
}
