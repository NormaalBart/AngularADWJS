/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
  ],
  safelist: [
    'bg-white',
    'bg-green-500',
    'hover:bg-green-600',
    'bg-secondary',
    'hover:bg-secondary-800'
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: {
          50: '#E3F7FF',
          100: '#B8E6FF',
          200: '#8FD4FF',
          300: '#66C2FF',
          400: '#3DB1FF',
          500: '#14A0FF',
          600: '#0084CC',
          700: '#006699',
          800: '#004966',
          900: '#002C33',
          DEFAULT: '#B8E6FF'
        },        
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

