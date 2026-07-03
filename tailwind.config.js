/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF8F2',
        secondary: '#FFF3E6',
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        accent: {
          DEFAULT: '#FB923C',
          hover: '#F97316',
        },
        text: {
          main: '#1F2937',
          secondary: '#6B7280',
        },
        glass: 'rgba(255,248,242,0.75)',
        success: '#22C55E',
        danger: '#EF4444',
        border: 'rgba(0,0,0,0.07)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        btn: '14px',
        input: '14px',
        card: '20px',
        modal: '24px',
        xl2: '20px',
      },
      boxShadow: {
        // Soft card shadow — layered for depth
        soft: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)',
        // Elevated card / modal shadow — warm amber tint
        floating: '0 4px 16px rgba(0,0,0,0.06), 0 12px 40px rgba(245,158,11,0.08)',
        // Hover state glow — for interactive cards
        glow: '0 8px 30px rgba(245,158,11,0.14), 0 2px 8px rgba(0,0,0,0.05)',
        // Primary button shadow
        'btn-primary': '0 2px 8px rgba(245,158,11,0.38), 0 1px 2px rgba(0,0,0,0.08)',
        // Focus ring
        'focus-ring': '0 0 0 3px rgba(245,158,11,0.18)',
        // Leaderboard #1 card
        'gold': '0 8px 40px rgba(245,158,11,0.22), 0 2px 8px rgba(0,0,0,0.06)',
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      },
      lineHeight: {
        hero: '1.1',
      },
    },
  },
  plugins: [],
}
