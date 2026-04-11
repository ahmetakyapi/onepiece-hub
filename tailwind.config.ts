import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ocean: {
          deep:    '#0a1628',
          surface: '#0f1f3a',
          mid:     '#143052',
          shallow: '#1a4070',
          light:   '#1e4a7a',
        },
        gold: {
          DEFAULT: '#f4a300',
          soft:    '#3d2a00',
          glow:    '#7a5200',
          bright:  '#fbbf24',
          dim:     '#b37900',
        },
        sea: {
          DEFAULT: '#1e90ff',
          soft:    '#0a2a4d',
          glow:    '#0d3a6b',
          light:   '#60b8ff',
        },
        luffy: {
          DEFAULT: '#e74c3c',
          soft:    '#3d1410',
          glow:    '#7a2820',
        },
        pirate: {
          text:    '#e8eaf0',
          muted:   '#8b8fa3',
          border:  '#1c3a5c',
        },
      },
      backgroundImage: {
        'ocean-gradient': 'radial-gradient(circle at 20% 10%, rgba(244,163,0,0.08), transparent 30%), radial-gradient(circle at 80% 15%, rgba(30,144,255,0.12), transparent 28%), radial-gradient(circle at 50% 90%, rgba(231,76,60,0.05), transparent 25%)',
        'grid-ocean': 'linear-gradient(rgba(30,144,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
      animation: {
        float:           'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'float-slow':    'float 8s ease-in-out infinite',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':     'spin 8s linear infinite',
        blink:           'blink 1.1s step-end infinite',
        wave:            'wave 8s ease-in-out infinite',
        'wave-slow':     'wave 12s ease-in-out infinite',
        ripple:          'ripple 2s ease-out infinite',
        shimmer:         'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':       { transform: 'translateY(-16px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '25%':       { transform: 'translateX(-5px) translateY(-3px)' },
          '50%':       { transform: 'translateX(0) translateY(-6px)' },
          '75%':       { transform: 'translateX(5px) translateY(-3px)' },
        },
        ripple: {
          '0%':   { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 40px rgba(244,163,0,0.2)',
        'sea-glow':  '0 0 40px rgba(30,144,255,0.2)',
        'card':      '0 14px 34px rgba(2,6,23,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
