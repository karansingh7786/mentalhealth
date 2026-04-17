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
        background: '#f8fafc',
        panel: '#ffffff',
        primary: '#3b82f6',
        low: '#22c55e',
        medium: '#eab308',
        high: '#ef4444'
      }
    },
  },
  plugins: [],
}
