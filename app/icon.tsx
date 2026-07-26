import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'

const ACCENT = '#5b4fe0'
const CANVAS = '#f9fafb'

// Three sizes from one file: 32px for the browser tab, 192/512 for manifest.ts (PWA install
// icons / Android home-screen). Same generated mark at each size rather than three files.
const ICON_SIZES = [32, 192, 512]

export function generateImageMetadata() {
  return ICON_SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType,
  }))
}

export default function Icon({ id }: { id: string }) {
  const size = Number(id)
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
        fontSize: size * 0.5625,
        fontWeight: 700,
        fontFamily: 'sans-serif',
      }}
    >
      KA
    </div>,
    { width: size, height: size },
  )
}
