'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_GEOMETRY,
  PLAYER_STORAGE_KEYS,
  type EmbedGeometry,
} from '@/lib/player-config'

export type EmbedMode = 'zoom' | 'full'

export type PlayerPrefs = {
  /** `zoom` = OnePaceTR sayfası video alanına kırpılır, `full` = sayfa olduğu gibi */
  embedMode: EmbedMode
  /** Kırpma geometrisi — kullanıcı kalibre edebilir */
  geometry: EmbedGeometry
  /** Bölüm süresi dolunca otomatik sonraki bölüme geç */
  autoAdvance: boolean
  /** Sahne ekrandan çıkınca mini oynatıcıya dock et */
  miniPlayer: boolean
}

export const DEFAULT_PREFS: PlayerPrefs = {
  embedMode: 'zoom',
  geometry: DEFAULT_GEOMETRY,
  autoAdvance: false,
  miniPlayer: true,
}

function readPrefs(): PlayerPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(PLAYER_STORAGE_KEYS.prefs)
    if (!raw) return DEFAULT_PREFS
    const parsed = JSON.parse(raw) as Partial<PlayerPrefs>
    return {
      embedMode: parsed.embedMode === 'full' ? 'full' : 'zoom',
      geometry: { ...DEFAULT_GEOMETRY, ...(parsed.geometry ?? {}) },
      autoAdvance: parsed.autoAdvance === true,
      miniPlayer: parsed.miniPlayer !== false,
    }
  } catch {
    return DEFAULT_PREFS
  }
}

/**
 * Oynatıcı tercihleri — localStorage'da saklanır (DB'ye yazılmaz, cihaza özel).
 *
 * `hydrated` false olduğu sürece DEFAULT_PREFS döner; böylece SSR/client
 * uyumsuzluğu olmaz. Geometriye bağlı stiller `hydrated` beklemeli.
 */
export function usePlayerPrefs() {
  const [prefs, setPrefs] = useState<PlayerPrefs>(DEFAULT_PREFS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setPrefs(readPrefs())
    setHydrated(true)
  }, [])

  const update = useCallback((patch: Partial<PlayerPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch }
      try {
        localStorage.setItem(PLAYER_STORAGE_KEYS.prefs, JSON.stringify(next))
      } catch {
        // kota dolu / private mode — tercih bu oturumda geçerli kalır
      }
      return next
    })
  }, [])

  const updateGeometry = useCallback(
    (patch: Partial<EmbedGeometry>) => {
      setPrefs((prev) => {
        const next = { ...prev, geometry: { ...prev.geometry, ...patch } }
        try {
          localStorage.setItem(PLAYER_STORAGE_KEYS.prefs, JSON.stringify(next))
        } catch {
          // yoksay
        }
        return next
      })
    },
    [],
  )

  const resetGeometry = useCallback(() => {
    updateGeometry(DEFAULT_GEOMETRY)
  }, [updateGeometry])

  return { prefs, hydrated, update, updateGeometry, resetGeometry }
}
