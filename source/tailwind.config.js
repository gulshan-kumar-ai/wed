/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#E67E22',
          light: '#F3A65A',
          dark: '#B85F12',
        },
        crimson: {
          DEFAULT: '#A93226',
          light: '#C8553F',
          dark: '#7A1F17',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#EBD488',
          pale: '#F6EBC4',
          dark: '#9C7A1E',
        },
        ivory: {
          DEFAULT: '#FDF8F0',
          deep: '#F6EBDA',
        },
        charcoal: {
          DEFAULT: '#2C221E',
          soft: '#4A3A33',
        },
      },
      fontFamily: {
        // Noto Naskh Arabic draws the Urdu and Sindhi letters; Latin text keeps the first font
        display: ['"Cormorant Garamond"', '"Noto Naskh Arabic"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Noto Naskh Arabic"', 'Inter', 'system-ui', 'sans-serif'],
        deva: ['"Noto Serif Devanagari"', '"Nirmala UI"', 'serif'],
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.75', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        drift: {
          '0%': { transform: 'translateX(-6%)' },
          '100%': { transform: 'translateX(6%)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        glow: 'glow 2.6s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite alternate',
        'drift-slow': 'drift 28s ease-in-out infinite alternate-reverse',
        'spin-slow': 'spin-slow 90s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
