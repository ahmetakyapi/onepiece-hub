'use client'

import { useEffect } from 'react'
import { useMotionTemplate, useMotionValue } from 'framer-motion'

/**
 * Mouse takip eden radial gradient spotlight.
 * Hero bölümü veya sayfa arka planına uygulanır.
 *
 * const spotlight = useSpotlight()
 * <motion.div style={{ background: spotlight }} />
 */
export function useSpotlight(radius = 620, color = 'rgba(244,163,0,0.06)') {
  // Başlangıç ekranın çok dışında; -600'de ışığın kenarı köşeye taşabiliyordu.
  const mx = useMotionValue(-10000)
  const my = useMotionValue(-10000)

  useEffect(() => {
    // Yalnız gerçek fare: iOS dokunuşta da mousemove gönderiyor ve ışık
    // dokunulan yerde takılı kalıp sayfanın üstünü buğulu gösteriyor
    // (Derinay'da görüldü, 3 Ekim 2026).
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const handler = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mx, my])

  return useMotionTemplate`radial-gradient(${radius}px circle at ${mx}px ${my}px, ${color}, transparent 78%)`
}
