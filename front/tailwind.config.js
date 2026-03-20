/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'barber-gold': '#D4AF37',
        'barber-bronze': '#CD7F32',
        'barber-black': '#0A0A0A',
        'barber-charcoal': '#1A1A1A',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
