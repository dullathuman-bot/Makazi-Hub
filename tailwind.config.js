/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyprus: {
          DEFAULT: '#004643',
          50: '#e6f0ef',
          100: '#c1dcd9',
          200: '#8fbcb7',
          300: '#5e9c94',
          400: '#2d7d72',
          500: '#004643',
          600: '#003c39',
          700: '#00302e',
          800: '#002422',
          900: '#001817',
        },
        sand: {
          DEFAULT: '#F0EAD6',
          50: '#fdfbf6',
          100: '#faf6ea',
          200: '#F0EAD6',
          300: '#e3dab8',
          400: '#d4c794',
          500: '#c5b470',
          600: '#b6a14c',
          700: '#948338',
          800: '#73622c',
          900: '#524120',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'breathe': 'breathe 20s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '50%': { transform: 'scale(1.05) translateY(-1%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
