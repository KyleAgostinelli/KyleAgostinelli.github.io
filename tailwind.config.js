/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Manrope"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 32px 90px -46px rgba(0, 0, 0, 0.88), 0 6px 18px rgba(0, 0, 0, 0.32)',
        float: '0 20px 46px -28px rgba(255, 255, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
