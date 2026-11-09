/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          main: '#0D0E12',
          surface: '#181A20',
          border: '#2A2D35',
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
        },
        light: {
          main: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          primary: '#111827',
          secondary: '#6B7280',
        }
      }
    },
  },
  plugins: [],
}
