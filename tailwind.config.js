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
      // Design "Mono": black and white. Colours live as CSS variables in src/css/input.css.
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
