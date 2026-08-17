'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY, type Theme } from '@/lib/theme-config'

/* Tema sistemi — next-themes YOK.
   Proje zaten custom JWT/auth deseni izliyor; tek bir attribute'u sürmek için
   ekstra bağımlılık taşımıyoruz. Ekosistemde Mimio ve Açılış Zili de aynı
   `data-theme` desenini kullanıyor.

   İki katmanlı çalışır:
   1. `app/layout.tsx`'teki blocking script ilk boyamadan önce yazar (FOUC yok).
   2. Buradaki mount effect'i tercihi YENİDEN uygular (aşağıdaki nota bak). */

export { THEME_STORAGE_KEY, type Theme } from '@/lib/theme-config'

type ThemeContextValue = {
  theme: Theme
  /** Mount öncesi false — ikon/etiket render'ını beklet (hydration uyumu). */
  mounted: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Tercihin tek kaynağı: kullanıcı seçimi > sistem tercihi > dark. */
function resolvePreferredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* private mode / kota */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    /* Attribute'u OKUMAKLA yetinmiyoruz, yeniden YAZIYORUZ.

       Sebep: `loading.tsx` taşıyan rotalarda (ör. /arcs, /characters) Next
       istemci tarafında tam yeniden render'a düşüyor (BAILOUT_TO_CLIENT_SIDE_
       RENDERING). React o sırada kök elemanı yeniden kuruyor ve `<html>`
       JSX'teki SSR değerine — `data-theme="dark"` — geri dönüyor; blocking
       script'in yazdığı değer siliniyor. Light tercihli kullanıcı bu
       sayfalarda koyu tema görüyordu.

       Burada tercihi kaynağından çözüp tekrar uygulayınca hangi render
       moduna düşülürse düşülsün sonuç doğru kalıyor. */
    const preferred = resolvePreferredTheme()
    applyTheme(preferred)
    setThemeState(preferred)
    setMounted(true)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* private mode / kota — tema yine de bu oturumda geçerli */
    }
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(resolvePreferredTheme() === 'light' ? 'dark' : 'light')
  }, [setTheme])

  /* Kullanıcı ELLE seçim yapmadıysa sistem tercihini izle. Seçim yaptıysa
     localStorage dolu olur ve sistem değişimi yok sayılır. */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return
      } catch {
        return
      }
      const next: Theme = e.matches ? 'light' : 'dark'
      applyTheme(next)
      setThemeState(next)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, mounted, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme, ThemeProvider içinde kullanılmalı')
  return ctx
}
