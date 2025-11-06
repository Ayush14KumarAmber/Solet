/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vote: {
          active: '#22c55e',
          pending: '#f59e0b',
          ended: '#6b7280',
        },
      },
      backgroundImage: {
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))',
        'gradient-hero': 'linear-gradient(135deg, #6366f1, #8b5cf6)'
      },
      boxShadow: {
        'card': '0 10px 25px -10px rgba(99,102,241,0.4)',
      },
      keyframes: {
        'hover-pop': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
      },
      animation: {
        'hover-pop': 'hover-pop 200ms ease-out forwards',
      },
    },
  },
  plugins: [],
}


