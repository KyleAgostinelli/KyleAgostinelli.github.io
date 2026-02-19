/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(78, 204, 255, 0.26), 0 12px 36px -16px rgba(5, 172, 230, 0.75)',
      },
    },
  },
  plugins: [],
}
