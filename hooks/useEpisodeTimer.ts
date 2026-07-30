'use client'

import { useEffect, useRef, useState } from 'react'
import { parseDurationSeconds } from '@/lib/player-config'

/**
 * Bölüm izleme sayacı — "sıradaki bölüm" kartını tetiklemek için.
 *
 * ⚠️ Bu bir *tahmin*. iframe cross-origin olduğu için gerçek oynatma
 * konumunu okuyamıyoruz; sayaç, oynatıcı yüklendiği andan itibaren geçen
 * duvar saati süresini bölüm süresiyle karşılaştırır.
 *
 * Doğruluğu artıran iki davranış:
 *  - sekme gizliyken sayaç durur (`visibilitychange`)
 *  - bölüm değişince sıfırlanır
 *
 * Bu yüzden otomatik geçiş varsayılan olarak KAPALI — kullanıcı açmalı.
 */
export function useEpisodeTimer(episodeSlug: string, duration: string, running: boolean) {
  const durationSeconds = parseDurationSeconds(duration)
  const [elapsed, setElapsed] = useState(0)
  const elapsedRef = useRef(0)

  // Bölüm değişti — sayacı sıfırla
  useEffect(() => {
    elapsedRef.current = 0
    setElapsed(0)
  }, [episodeSlug])

  useEffect(() => {
    if (!running || durationSeconds === 0) return

    const tick = () => {
      if (document.visibilityState !== 'visible') return
      elapsedRef.current += 1
      setElapsed(elapsedRef.current)
    }

    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [running, durationSeconds, episodeSlug])

  const remaining = durationSeconds > 0 ? Math.max(0, durationSeconds - elapsed) : null

  return { elapsed, remaining, durationSeconds }
}
