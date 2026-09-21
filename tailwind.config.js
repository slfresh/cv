/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,mjs}",
    "./scripts/build.mjs",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        // Design "B": calm navy + petrol
        navy: {
          50: '#EEF2F7',
          100: '#D5DEEA',
          200: '#A9B9CF',
          300: '#6F86A6',
          400: '#1F3A5F',
          500: '#12233D',
          600: '#0E1B30',
          700: '#0B1524',
          800: '#070E19',
          900: '#04080F',
        },
        petrol: {
          50: '#E6F5F3',
          100: '#C2E8E4',
          200: '#8FD5CE',
          300: '#4FBDB3',
          400: '#1FA399',
          500: '#0F8F86',
          600: '#0B6B64',
          700: '#09544F',
          800: '#073F3B',
          900: '#052C29',
        },
        line: '#DDE3EA',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
