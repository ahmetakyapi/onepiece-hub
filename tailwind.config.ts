import type { Config } from 'tailwindcss'

/* Palet tokenları `app/globals.css` içinde RGB kanal üçlüsü olarak tanımlı
   (`--ocean-deep: 6 14 26`). Burada `rgb(var(--x) / <alpha-value>)` sarmalı
   sayesinde `bg-ocean-deep` de `bg-ocean-deep/40` de çalışır — ve ikisi de
   `<html data-theme>` değişince otomatik olarak tema değiştirir.

   Bu yüzden bileşenlerde renk sınıfı değiştirmeye gerek yok: 3300'den fazla
   `bg-` · `text-` · `border-` kullanımı tek yerden iki temaya bağlandı. */
const token = (name: string) => `rgb(var(${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  /* Tema `<html data-theme="light|dark">` ile sürülür (next-themes yok —
     `ThemeProvider` custom). `dark:` varyantı yine de çalışsın diye selector
     olarak data-attribute veriliyor. */
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      /* Yükseklik tabanlı varyant. Yatay mobilde ve kısa masaüstü pencerelerinde
         modal chrome'unu kısmak için; genişlik breakpoint'leriyle çakışmaz. */
      screens: {
        short: { raw: '(max-height: 500px)' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        /* Etiket / veri — Space Mono. Eyebrow'lar, ödüller, bölüm numaraları. */
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        ocean: {
          deep:     token('--ocean-deep'),
          surface:  token('--ocean-surface'),
          elevated: token('--ocean-elevated'),
          mid:      token('--ocean-mid'),
          shallow:  token('--ocean-shallow'),
          light:    token('--ocean-light'),
        },
        gold: {
          DEFAULT: token('--gold'),
          soft:    token('--gold-soft'),
          glow:    token('--gold-glow'),
          bright:  token('--gold-bright'),
          dim:     token('--gold-dim'),
        },
        sea: {
          DEFAULT: token('--sea'),
          soft:    token('--sea-soft'),
          glow:    token('--sea-glow'),
          light:   token('--sea-light'),
        },
        luffy: {
          DEFAULT: token('--luffy'),
          soft:    token('--luffy-soft'),
          glow:    token('--luffy-glow'),
        },
        pirate: {
          text:   token('--pirate-text'),
          muted:  token('--pirate-muted'),
          border: token('--pirate-border'),
          /* Üçüncül metin — "sırada / izlenmedi" satırları, pasif rozetler.
             Tasarımda dark `#3d5a7a`, light `#9aa7b5`. */
          dim:    token('--pirate-dim'),
        },
        /* Şeytan Meyveleri · Haki · Şichibukai kategorilerinin vurgu rengi.
           Ham `purple-*` sınıfı yazma — bu token'ı kullan.

           Ekip kimlik renkleri (`CharacterAvatar` → CREW_GRADIENTS) ayrı bir
           sistemdir ve buraya dahil değildir: orada 15 ekibin her birinin
           kendi rengi var, o bir içerik paleti — marka sistemi değil. */
        fruit: {
          light:   token('--fruit-light'),
          DEFAULT: token('--fruit'),
          strong:  token('--fruit-strong'),
          deep:    token('--fruit-deep'),
        },
        /* İzlendi / tamamlandı durumu. Dark #22c55e · light #16a34a. */
        haki: {
          DEFAULT: token('--haki'),
          deep:    token('--haki-deep'),
        },
        /* Metin rengiyle aynı yönde saydam katman: dark'ta beyaz, light'ta
           lacivert. `bg-white/[0.04]` yerine `bg-ink/[0.04]` yazılır — light
           temada beyaz üstüne beyaz yıkama görünmez oluyordu. */
        ink: token('--ink'),

        /* Çok öğeli içerik sınıflandırmaları (saga · deniz · meyve türü ·
           tehlike seviyesi · başarım kademesi). Light temada 700/800
           seviyeye döner. Ham `cyan-*` / `emerald-*` / `amber-*` / `teal-*`
           / `rose-*` / `pink-*` / `indigo-*` / `orange-*` yazma. */
        accent: {
          cyan:    token('--accent-cyan'),
          teal:    token('--accent-teal'),
          emerald: token('--accent-emerald'),
          lime:    token('--accent-lime'),
          amber:   token('--accent-amber'),
          orange:  token('--accent-orange'),
          rose:    token('--accent-rose'),
          pink:    token('--accent-pink'),
          indigo:  token('--accent-indigo'),
          silver:  token('--accent-silver'),
          bronze:  token('--accent-bronze'),
        },
      },
      backgroundImage: {
        'ocean-gradient': 'radial-gradient(circle at 20% 10%, rgb(var(--gold) / 0.08), transparent 30%), radial-gradient(circle at 80% 15%, rgb(var(--sea) / 0.12), transparent 28%), radial-gradient(circle at 50% 90%, rgb(var(--luffy) / 0.05), transparent 25%)',
        'grid-ocean': 'linear-gradient(rgb(var(--sea) / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--sea) / 0.03) 1px, transparent 1px)',
        'grid-dot': 'radial-gradient(circle, rgb(var(--sea) / 0.08) 1px, transparent 1px)',
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
      letterSpacing: {
        /* Space Mono eyebrow ölçeği — tasarımdaki .18em–.26em aralığı */
        eyebrow: '0.2em',
        'eyebrow-wide': '0.26em',
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
        'gold-glow':   '0 0 40px rgb(var(--gold) / 0.15), 0 0 80px rgb(var(--gold) / 0.05)',
        'sea-glow':    '0 0 40px rgb(var(--sea) / 0.15), 0 0 80px rgb(var(--sea) / 0.05)',
        'card':        'var(--shadow-card)',
        'card-hover':  'var(--shadow-card-hover)',
        'inner-glow':  'var(--shadow-inner-glow)',
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
