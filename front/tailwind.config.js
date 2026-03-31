/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Oswald', 'sans-serif'],
      },
      colors: {
        'neon-green': '#39FF14',
        'neon-green-dark': '#2eff2e',
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
