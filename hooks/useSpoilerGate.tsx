'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ARCS } from '@/lib/constants/arcs'

const STORAGE_KEY = 'onepiece-spoiler-gate'

/* Spoiler kapısı — TEK kaynak, provider üzerinden.

   Bu daha önce düz bir hook'tu: `useSpoilerGate()` çağıran her bileşen KENDİ
   `useState`'ini kuruyordu. Widget bir kopya, listedeki her `ArcCard` ayrı bir
   kopya (36 arc = 36 bağımsız state) tutuyordu. Anahtarı çevirmek yalnızca
   widget'ın kopyasını değiştiriyor, kartlar sayfa yeniden yüklenene kadar eski
   değerde kalıyordu — yani koruma "çalışmıyor" görünüyordu.

   Provider'a çekince tek state'i herkes dinliyor. `ThemeProvider` ve
   `AuthProvider` ile aynı desen. */

interface SpoilerGateState {
  enabled: boolean
  currentArcSlug: string | null
}

const DEFAULT_STATE: SpoilerGateState = {
  enabled: false,
  currentArcSlug: null,
}

type SpoilerGateContextValue = {
  enabled: boolean
  currentArcSlug: string | null
  currentArcIndex: number
  /** Mount öncesi false — SSR ile aynı çıktıyı verip hydration'ı bozmaz. */
  mounted: boolean
  /** Koruma gerçekten iş yapıyor mu: açık VE geçerli bir arc seçili. */
  active: boolean
  /** Şu an kaç arc gizleniyor — arayüzde somut geri bildirim için. */
  hiddenCount: number
  setEnabled: (enabled: boolean) => void
  setCurrentArc: (slug: string | null) => void
  isSpoiler: (arcSlug: string | undefined) => boolean
}

const SpoilerGateContext = createContext<SpoilerGateContextValue | null>(null)

function readStoredState(): SpoilerGateState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<SpoilerGateState>
    return {
      enabled: Boolean(parsed.enabled),
      currentArcSlug: typeof parsed.currentArcSlug === 'string' ? parsed.currentArcSlug : null,
    }
  } catch {
    /* private mode / bozuk JSON — varsayılana düş */
    return DEFAULT_STATE
  }
}

export function SpoilerGateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SpoilerGateState>(DEFAULT_STATE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setState(readStoredState())
    setMounted(true)
  }, [])

  /* Fonksiyonel update: iki çağrı aynı tick'te gelirse ikincisi birincisini
     eski değerle ezmiyor. Eski sürüm `{ ...state }` yayıyordu. */
  const update = useCallback((patch: (prev: SpoilerGateState) => SpoilerGateState) => {
    setState(prev => {
      const next = patch(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* kota / private mode — state yine de bellekte doğru */
      }
      return next
    })
  }, [])

  const setEnabled = useCallback((enabled: boolean) => {
    update(prev => ({ ...prev, enabled }))
  }, [update])

  /* Arc seçmek niyeti açık eden eylem: koruma kapalıyken bir arc seçen kullanıcı
     korumayı istiyordur, o yüzden seçim aynı anda açar. Eskiden iki ayrı adım
     gerekiyordu ve birini atlayınca hiçbir şey olmuyordu, sebebi de söylenmiyordu. */
  const setCurrentArc = useCallback((slug: string | null) => {
    update(prev => ({
      currentArcSlug: slug,
      enabled: slug ? true : prev.enabled,
    }))
  }, [update])

  const currentArcIndex = useMemo(
    () => (state.currentArcSlug ? ARCS.findIndex(a => a.slug === state.currentArcSlug) : -1),
    [state.currentArcSlug],
  )

  const active = mounted && state.enabled && currentArcIndex !== -1

  const isSpoiler = useCallback((arcSlug: string | undefined) => {
    if (!active || !arcSlug) return false
    const targetIndex = ARCS.findIndex(a => a.slug === arcSlug)
    if (targetIndex === -1) return false
    return targetIndex > currentArcIndex
  }, [active, currentArcIndex])

  const value = useMemo<SpoilerGateContextValue>(() => ({
    enabled: state.enabled,
    currentArcSlug: state.currentArcSlug,
    currentArcIndex,
    mounted,
    active,
    hiddenCount: active ? ARCS.length - 1 - currentArcIndex : 0,
    setEnabled,
    setCurrentArc,
    isSpoiler,
  }), [state.enabled, state.currentArcSlug, currentArcIndex, mounted, active, setEnabled, setCurrentArc, isSpoiler])

  return <SpoilerGateContext.Provider value={value}>{children}</SpoilerGateContext.Provider>
}

/* Provider dışında çağrılırsa patlamak yerine nötr değer döner: koruma kapalı
   sayılır, hiçbir kart gizlenmez. Bir tüketici yanlışlıkla ağacın dışında
   render edilirse sayfa çökmez, sadece koruma uygulanmaz. */
const INERT: SpoilerGateContextValue = {
  enabled: false,
  currentArcSlug: null,
  currentArcIndex: -1,
  mounted: false,
  active: false,
  hiddenCount: 0,
  setEnabled: () => {},
  setCurrentArc: () => {},
  isSpoiler: () => false,
}

export function useSpoilerGate(): SpoilerGateContextValue {
  return useContext(SpoilerGateContext) ?? INERT
}
