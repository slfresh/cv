/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.html",
    "./js/**/*.js",
    "./index.html",
    "./en/index.html"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EEF0F4',
          100: '#C8CDD8',
          200: '#8B99B3',
          300: '#4A5E80',
          400: '#1E3A5F',
          500: '#0F1A2E',
          600: '#0B1322',
          700: '#070D17',
          800: '#04080E',
          900: '#020407',
        },
        gold: {
          50: '#FBF9F5',
          100: '#F5F0E6',
          200: '#EBE1CC',
          300: '#D4B07A',
          400: '#C9944A',
          500: '#B8833D',
          600: '#9E8355',
          700: '#7D6740',
          800: '#5E4D30',
          900: '#403420',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
