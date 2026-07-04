/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        secondary: '#F5F0E8',
        primary: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        accent: {
          DEFAULT: '#FB923C',
          hover: '#F97316',
        },
        text: {
          main: '#111827',
          secondary: '#6B7280',
        },
        glass: 'rgba(255,248,242,0.80)',
        success: '#22C55E',
        danger: '#EF4444',
        border: 'rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        btn: '16px',
        input: '16px',
        card: '22px',
        modal: '26px',
        xl2: '22px',
        chip: '999px',
      },
      boxShadow: {
        // Barely-there ambient shadow — default cards
        soft: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.035)',
        // Elevated card / modal — warm tint, no heavy dark
        floating: '0 4px 24px rgba(0,0,0,0.06), 0 16px 48px rgba(245,158,11,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
        // Hover lift — premium glow
        glow: '0 8px 32px rgba(245,158,11,0.16), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(245,158,11,0.12)',
        // Primary button
        'btn-primary': '0 2px 10px rgba(245,158,11,0.40), 0 1px 3px rgba(0,0,0,0.10)',
        // Focus ring
        'focus-ring': '0 0 0 3px rgba(245,158,11,0.20)',
        // Leaderboard gold card
        'gold': '0 8px 48px rgba(245,158,11,0.24), 0 2px 8px rgba(0,0,0,0.06)',
        // Sidebar / inset panel
        'inner-soft': 'inset 0 1px 3px rgba(0,0,0,0.05)',
      },
      letterSpacing: {
        tighter: '-0.03em',
        tight: '-0.015em',
        normal: '-0.005em',
      },
      lineHeight: {
        hero: '1.08',
        heading: '1.22',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
