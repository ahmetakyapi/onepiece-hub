'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CompassMark } from '@/components/brand/CompassMark'
import {
  CURTAIN_NAVIGATE_EVENT,
  EASE_CURTAIN,
  EASE_REVEAL,
  getRouteLabel,
  isEpisodePath,
  type RouteLabel,
} from '@/lib/motion'

/* ═══ Rota perdesi — sayfa geçişi ═════════════════════════════════════════
   Gezinme başlayınca üç katman (deniz → altın → lacivert) kavisli üst
   kenarla aşağıdan yükselip ekranı kapatır; ortada hedefin adı yazar.
   Ekran kapandığında asıl gezinme yapılır, yeni rota commit olunca katmanlar
   yukarı çıkıp yeni sayfayı açar.

   Nasıl: App Router'da çıkış animasyonu yok — `Link` tıklandığı anda eski
   ağaç atılır. Perdenin önce KAPANABİLMESİ için `useRouter()`ın döndürdüğü
   router nesnesinin `push`ı sarılır. `next/link` de aynı context nesnesinin
   `push`ını çağırdığı için tek noktadan HER gezinme yakalanır: linkler,
   komut paleti, kartlar. Linklerin kendi onClick mantığı (ör. spoiler
   kilidi `preventDefault` edip gezinmeyi hiç başlatmaz) olduğu gibi çalışır,
   çünkü araya tıklamada değil gezinmede giriyoruz. Router nesnesi yeniden
   oluşursa effect yeniden sarar; unmount'ta orijinal geri konur.

   Perde OYNAMAZ (orijinal `push` doğrudan çağrılır):
   - `prefers-reduced-motion`
   - bölümden bölüme (izleme akışı + kalıcı iframe)
   - aynı rota (yalnız query/hash değişiyorsa), dış URL, `replace` */

type Phase = 'idle' | 'covering' | 'covered' | 'revealing'

/** Prefetch hatası gezinmeyi asla engellemesin (dev'de no-op, bot'ta atlanır) */
function originalPrefetch(router: { prefetch: (href: string) => void }, href: string) {
  try { router.prefetch(href) } catch { /* yok say */ }
}

const COVER_MS = 720
const SAFETY_MS = 9000

const LAYERS = [
  { className: 'bg-sea', delayIn: 0, delayOut: 0.14 },
  { className: 'bg-gold', delayIn: 0.06, delayOut: 0.07 },
  { className: 'bg-ocean-deep', delayIn: 0.12, delayOut: 0 },
] as const

export default function RouteCurtain() {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('idle')
  const [label, setLabel] = useState<RouteLabel>({ eyebrow: '', title: '' })
  const phaseRef = useRef<Phase>('idle')
  const targetRef = useRef<string | null>(null)
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTopRef = useRef(true)

  const set = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhase(p)
  }, [])

  const reveal = useCallback(() => {
    if (safetyTimer.current) clearTimeout(safetyTimer.current)
    if (phaseRef.current === 'idle') return
    set('revealing')
  }, [set])

  const cover = useCallback((url: URL, navigate: () => void) => {
    targetRef.current = url.pathname
    setLabel(getRouteLabel(url.pathname))
    originalPrefetch(router, url.pathname + url.search)
    set('covering')

    pushTimer.current = setTimeout(() => {
      set('covered')
      navigate()
    }, COVER_MS)
    safetyTimer.current = setTimeout(reveal, SAFETY_MS)
  }, [reveal, router, set])

  // `push`ı sar — Link dahil tüm gezinmeler buradan geçer
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches) return

    const target = router as typeof router & { push: typeof router.push }
    const original = target.push

    target.push = (href, options) => {
      let next: URL
      try { next = new URL(href, window.location.href) } catch { return original(href, options) }
      const here = window.location.pathname
      const skip =
        phaseRef.current !== 'idle' ||
        next.origin !== window.location.origin ||
        next.pathname === here ||
        (isEpisodePath(next.pathname) && isEpisodePath(here))
      if (skip) return original(href, options)
      scrollTopRef.current = options?.scroll !== false
      cover(next, () => original(href, options))
    }
    document.documentElement.setAttribute('data-curtain', '')

    return () => {
      target.push = original
      document.documentElement.removeAttribute('data-curtain')
    }
  }, [router, cover])

  // Programatik tetikleme (event) — router'a erişimi olmayan yerler için
  useEffect(() => {
    const onProgrammatic = (e: Event) => {
      const href = (e as CustomEvent<string>).detail
      if (typeof href === 'string') router.push(href)
    }
    window.addEventListener(CURTAIN_NAVIGATE_EVENT, onProgrammatic)
    return () => window.removeEventListener(CURTAIN_NAVIGATE_EVENT, onProgrammatic)
  }, [router])

  // Yeni rota commit oldu → perdeyi aç. Bir kare bekle ki yeni sayfa boyansın.
  useEffect(() => {
    if (phaseRef.current !== 'covered' && phaseRef.current !== 'covering') return
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        // Perde henüz tam kapanmadan rota geldiyse (hızlı prefetch) kapanmayı bekle
        if (phaseRef.current === 'covering') return
        // Perde kapalıyken en üste al — açılınca yeni sayfa baştan görünsün
        if (scrollTopRef.current && !window.location.hash) window.scrollTo(0, 0)
        reveal()
      })
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [pathname, reveal])

  useEffect(() => () => {
    if (pushTimer.current) clearTimeout(pushTimer.current)
    if (safetyTimer.current) clearTimeout(safetyTimer.current)
  }, [])

  const onRevealDone = () => {
    if (phaseRef.current !== 'revealing') return
    set('idle')
    targetRef.current = null
  }

  const visible = phase !== 'idle'
  const out = phase === 'revealing'

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[300]" aria-hidden key="curtain">
          {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.className}
                className={`absolute inset-x-0 -bottom-[10vh] -top-[10vh] ${layer.className}`}
                style={{
                  borderTopLeftRadius: out ? 0 : '50% 10vh',
                  borderTopRightRadius: out ? 0 : '50% 10vh',
                  borderBottomLeftRadius: out ? '50% 10vh' : 0,
                  borderBottomRightRadius: out ? '50% 10vh' : 0,
                }}
                initial={{ y: '100%' }}
                animate={out ? { y: '-100%' } : { y: '0%' }}
                transition={{
                  duration: out ? 0.85 : 0.62,
                  ease: EASE_CURTAIN,
                  delay: out ? layer.delayOut : layer.delayIn,
                }}
                /* Çıkışta en son giden katman en alttaki (deniz) — bitişi o bildirir */
                onAnimationComplete={i === 0 ? onRevealDone : undefined}
              />
          ))}

          {/* Hedef etiketi — en üst katmanla birlikte gelir, onunla gider */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            initial={{ opacity: 0 }}
            animate={out ? { opacity: 0, y: -80 } : { opacity: 1, y: 0 }}
            transition={{ duration: out ? 0.45 : 0.3, ease: EASE_CURTAIN, delay: out ? 0 : 0.3 }}
          >
            <motion.div
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: EASE_REVEAL, delay: 0.35 }}
              className="mb-6"
            >
              <CompassMark size={44} className={phase === 'covered' ? 'animate-[spin_2.4s_linear_infinite]' : ''} />
            </motion.div>
            <div className="overflow-hidden">
              <motion.p
                className="eyebrow-lg text-gold"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: EASE_REVEAL, delay: 0.38 }}
              >
                {label.eyebrow}
              </motion.p>
            </div>
            <div className="mt-2 overflow-hidden pb-1">
              <motion.p
                className="text-4xl font-extrabold tracking-tight text-pirate-text sm:text-6xl lg:text-7xl"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: EASE_REVEAL, delay: 0.44 }}
              >
                {label.title}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
