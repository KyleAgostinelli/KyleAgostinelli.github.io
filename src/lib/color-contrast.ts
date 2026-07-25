export interface Oklch {
  l: number
  c: number
  h: number
}

// Björn Ottosson's OKLab/OKLCH -> linear sRGB conversion.
// https://bottosson.github.io/posts/oklab/
function oklchToLinearSrgb({ l: L, c: C, h: Hdeg }: Oklch): [number, number, number] {
  const h = (Hdeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  return [r, g, blue]
}

// WCAG relative luminance is defined on *linear* RGB, which is exactly what the OKLab
// conversion above produces - no gamma round-trip needed.
function relativeLuminance(linearRgb: [number, number, number]): number {
  const [r, g, b] = linearRgb
  return 0.2126 * Math.max(0, r) + 0.7152 * Math.max(0, g) + 0.0722 * Math.max(0, b)
}

// WCAG 2.x contrast ratio between two colors, each given as OKLCH. Symmetric: it doesn't
// matter which argument is "foreground" vs "background".
export function contrastRatio(a: Oklch, b: Oklch): number {
  const lumA = relativeLuminance(oklchToLinearSrgb(a))
  const lumB = relativeLuminance(oklchToLinearSrgb(b))
  const lighter = Math.max(lumA, lumB)
  const darker = Math.min(lumA, lumB)
  return (lighter + 0.05) / (darker + 0.05)
}
