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
          deep:    '#060e1a',
          surface: '#0c1829',
          elevated: '#111f36',
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
        'grid-ocean': 'linear-gradient(rgba(30,144,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(30,144,255,0.03) 1px, transparent 1px)',
        'grid-dot': 'radial-gradient(circle, rgba(30,144,255,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '64px 64px',
        'grid-dot': '24px 24px',
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      animation: {
        'float':           'float 6s ease-in-out infinite',
        'float-delayed':   'float 6s ease-in-out 2s infinite',
        'float-slow':      'float 8s ease-in-out infinite',
        'pulse-slow':      'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':       'spin 8s linear infinite',
        'blink':           'blink 1.1s step-end infinite',
        'wave':            'wave 8s ease-in-out infinite',
        'wave-slow':       'wave 12s ease-in-out infinite',
        'ripple':          'ripple 2s ease-out infinite',
        'shimmer':         'shimmer 2s linear infinite',
        'morph':           'morph 8s ease-in-out infinite',
        'orbit':           'orbit 20s linear infinite',
        'slide-up':        'slide-up-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':        'scale-fade-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'text-shimmer':    'text-shimmer 3s linear infinite',
        'pulse-ring':      'pulse-ring 2s ease-out infinite',
        'gradient-shift':  'gradient-shift 6s ease-in-out infinite',
        'ocean-wave-1':    'wave-slide 22s linear infinite',
        'ocean-wave-2':    'wave-slide-reverse 16s linear infinite',
        'ocean-wave-3':    'wave-slide 11s linear infinite',
        'ocean-wave-4':    'wave-slide-reverse 8s linear infinite',
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
        'wave-slide': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'wave-slide-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      boxShadow: {
        'gold-glow':   '0 0 40px rgba(244,163,0,0.15), 0 0 80px rgba(244,163,0,0.05)',
        'sea-glow':    '0 0 40px rgba(30,144,255,0.15), 0 0 80px rgba(30,144,255,0.05)',
        'card':        '0 14px 34px rgba(2,6,23,0.3)',
        'card-hover':  '0 24px 48px rgba(2,6,23,0.4), 0 0 60px rgba(244,163,0,0.04)',
        'inner-glow':  'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.08)',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
