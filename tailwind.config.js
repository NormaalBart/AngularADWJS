/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
  ],
  safelist: [
    'bg-white',
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: '#B8E6FF',
        secondary: {
          50: '#f2f2fe',
          100: '#d9d7fd',
          200: '#b5b2fc',
          300: '#8e8afc',
          400: '#6d69fb',
          500: '#4b47fa',
          600: '#372de9',
          700: '#281fbe',
          800: '#1a1293',
          900: '#0c0568',
          DEFAULT: '#1807f8'
        }
      },
    },
  },
  plugins: [],
}

