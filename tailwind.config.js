/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0a1f2e',
        'bg-mid': '#0d2b3e',
        teal: {
          DEFAULT: '#0f4c5c',
          light: '#1a6b7e',
        },
        gold: {
          DEFAULT: '#d4a574',
          bright: '#e8c898',
          deep: '#b8893f',
        },
        cream: {
          DEFAULT: '#f5ebd6',
          soft: '#ebe0c8',
        },
        lapis: '#1e3a8a',
        crimson: '#8b2635',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heroTitleReveal: {
          '0%': { opacity: '0', letterSpacing: '40px', filter: 'blur(10px)' },
          '100%': { opacity: '1', letterSpacing: '12px', filter: 'blur(0)' },
        },
        bounceY: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        twinkle: 'twinkle 3s infinite',
        'fade-in-up': 'fadeInUp 1s ease forwards',
        'hero-title': 'heroTitleReveal 1.5s ease 0.6s forwards',
        'bounce-y': 'bounceY 2s ease infinite',
        shimmer: 'shimmer 3s linear infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
