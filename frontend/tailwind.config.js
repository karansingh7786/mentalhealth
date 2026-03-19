/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d1117',
        panel: '#1e242cf0',
        primary: '#58a6ff',
        low: '#2ea043',
        medium: '#d29922',
        high: '#f85149'
      }
    },
  },
  plugins: [],
}
