/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D3B66',
          light: '#1565A6',
          dark: '#082844',
        },
        secondary: {
          DEFAULT: '#FFC857',
          light: '#FFD67A',
          dark: '#E6B34F',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E0E0E0',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(13, 59, 102, 0.1), 0 10px 20px -2px rgba(13, 59, 102, 0.05)',
        'card': '0 4px 6px -1px rgba(13, 59, 102, 0.1), 0 2px 4px -1px rgba(13, 59, 102, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
}