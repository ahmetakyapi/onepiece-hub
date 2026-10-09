'use client'

import { useEffect, useState } from 'react'

/** Ağır, kaydırmaya bağlı efektler (parallax, sabitlenmiş yatay galeri,
 *  hız-duyarlı şerit) için kapı: yalnızca `min-width` üstünde VE kullanıcı
 *  hareket azaltma istemiyorsa `true`. CLAUDE.md § 16 "useScroll/useTransform
 *  gate" kuralının tek yerden uygulanışı. SSR ve ilk render'da `false`. */
export function useMotionGate(minWidth = 768): boolean {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setEnabled(wide.matches && !reduced.matches)
    apply()
    wide.addEventListener('change', apply)
    reduced.addEventListener('change', apply)
    return () => {
      wide.removeEventListener('change', apply)
      reduced.removeEventListener('change', apply)
    }
  }, [minWidth])
  return enabled
}
