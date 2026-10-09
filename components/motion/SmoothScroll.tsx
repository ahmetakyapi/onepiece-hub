'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { isIntroDone, subscribeIntro } from '@/lib/motion'

/* ═══ Yumuşak kaydırma (Lenis) ════════════════════════════════════════════
   Yalnızca fare/trackpad'li ekranlarda ve hareket tercihi açıkken. Dokunmatik
   kaydırmaya DOKUNULMAZ (Lenis varsayılanı `syncTouch: false`): mobilde
   yerel ivme zaten iyi, üstüne yazmak sticky bölümlerde takılma yapıyor.

   Lenis gerçek `window` kaydırmasını sürer, sanal kaydırma değil — bu yüzden
   `position: sticky`, `useScroll`, IntersectionObserver olduğu gibi çalışır.

   Etkileşim kuralları:
   - Modal/çekmece/sabit katman üstünde tekerlek → Lenis çekilir, tarayıcı
     yönetir (`prevent`). Aksi halde açık modalın arkasında sayfa kayardı.
   - İç içe kaydırılabilir kutular (bölüm listesi, arama sonuçları) kendi
     içinde kayar (`allowNestedScroll`).
   - Bir bileşen `body.style.overflow = 'hidden'` ile kilitlerse (sinema
     modu) Lenis durur, kilit kalkınca devam eder.
   - Açılış sekansı bitmeden başlamaz — preloader arkasında sayfa kaymasın. */

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    let observer: MutationObserver | null = null

    const create = () => {
      if (lenisRef.current) return
      const lenis = new Lenis({
        autoRaf: true,
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        wheelMultiplier: 1,
        allowNestedScroll: true,
        anchors: { offset: -120 },
        stopInertiaOnNavigate: true,
        prevent: (node) =>
          !!node.closest('[data-lenis-prevent], [role="dialog"], [aria-modal="true"], .fixed, iframe'),
      })
      lenisRef.current = lenis

      const sync = () => {
        if (document.body.style.overflow === 'hidden') lenis.stop()
        else lenis.start()
      }
      observer = new MutationObserver(sync)
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    }

    let unsubscribe: (() => void) | null = null
    if (isIntroDone()) create()
    else unsubscribe = subscribeIntro(create)

    return () => {
      unsubscribe?.()
      observer?.disconnect()
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
  }, [])

  // Rota değişince yeni sayfanın boyuna göre yeniden ölç. Kaydırma konumunu
  // Next/tarayıcı belirler (geri tuşunda geri yükleme dahil); Lenis yerel
  // scroll olayından kendini eşitler.
  useEffect(() => {
    lenisRef.current?.resize()
  }, [pathname])

  return null
}
