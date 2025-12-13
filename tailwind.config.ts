/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'arabic': ['var(--font-tajawal)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-amiri)', 'var(--font-tajawal)', 'serif'],
        'display': ['var(--font-amiri)', 'var(--font-tajawal)', 'serif'],
      },
      colors: {
        gold: {
          DEFAULT: "#E6C36A",
          50: "#FFF9E8",
          100: "#FCEFC9",
          200: "#F6E29A",
          300: "#F0D46D",
          400: "#EBC64F",
          500: "#E6C36A",
          600: "#C9A44D",
          700: "#A3833E",
          800: "#6B5A2B",
          900: "#3C3219"
        },
        light: "#F5F5F4",
        dark: "#0B0B0B"
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(90deg, #f5d97a, #d2b75f, #f5d97a)',
        'gold-gradient-radial': 'radial-gradient(circle, #f5d97a, #d2b75f)',
        'gold-gradient-conic': 'conic-gradient(from 180deg, #f5d97a, #d2b75f, #f5d97a)',
        'luxury-gradient': 'linear-gradient(135deg, #f5d97a 0%, #e6c36a 25%, #d2b75f 50%, #c9a44d 75%, #a3833e 100%)',
      },
      boxShadow: {
        'gold': '0 0 30px rgba(230,195,106,0.25)',
        'gold-lg': '0 0 50px rgba(230,195,106,0.35)',
        'gold-xl': '0 0 80px rgba(230,195,106,0.45)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'gold-pulse': 'gold-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.6s ease-out',
        'slide-down': 'slide-down 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'scale-in': 'scale-in 0.5s ease-out',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gold-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(230,195,106,0.3)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(230,195,106,0.6)',
            transform: 'scale(1.02)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': {
            boxShadow: '0 0 20px rgba(230,195,106,0.2)',
            filter: 'brightness(1)',
          },
          '100%': {
            boxShadow: '0 0 40px rgba(230,195,106,0.4)',
            filter: 'brightness(1.1)',
          },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.8)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
    },
  },
  plugins: [],
}
