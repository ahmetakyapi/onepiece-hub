'use client'

import { useCallback, useEffect, useState } from 'react'
import { PLAYER_STORAGE_KEYS } from '@/lib/player-config'

export type LastWatched = {
  arcSlug: string
  arcName: string
  episodeSlug: string
  episodeTitle: string
  episodeNumber: number
  episodeCount: number
  globalEpisode: number
  cover: string
  /** Kayıt zamanı — epoch ms */
  at: number
}

const EVENT = 'onepiece-last-watched-change'

function read(): LastWatched | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PLAYER_STORAGE_KEYS.lastWatched)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LastWatched
    return typeof parsed?.arcSlug === 'string' && typeof parsed?.episodeSlug === 'string'
      ? parsed
      : null
  } catch {
    return null
  }
}

/** Son açılan bölümü kaydet — WatchPage mount olurken çağırır */
export function recordLastWatched(entry: Omit<LastWatched, 'at'>) {
  if (typeof window === 'undefined') return
  try {
    const payload: LastWatched = { ...entry, at: Date.now() }
    localStorage.setItem(PLAYER_STORAGE_KEYS.lastWatched, JSON.stringify(payload))
    window.dispatchEvent(new Event(EVENT))
  } catch {
    // yoksay
  }
}

/**
 * "Kaldığın yerden devam et" verisi.
 *
 * localStorage tabanlı, cihaza özel. `hydrated` false iken null döner —
 * resume bileşenleri bunu bekleyip layout shift'i önlemeli.
 */
export function useLastWatched() {
  const [lastWatched, setLastWatched] = useState<LastWatched | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setLastWatched(read())
    setHydrated(true)

    const sync = () => setLastWatched(read())
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(PLAYER_STORAGE_KEYS.lastWatched)
    } catch {
      // yoksay
    }
    setLastWatched(null)
  }, [])

  return { lastWatched, hydrated, clear }
}
